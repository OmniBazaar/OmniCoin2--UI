import { orderBy, zip, uniqBy } from 'lodash';
import { FetchChain, ChainStore, ChainTypes } from 'omnibazaarjs/es';
import { Apis } from 'omnibazaarjs-ws';

import BaseStorage from '../../utils/baseStorage';
import { decodeMemo, generateKeyFromPassword } from '../blockchain/utils/wallet';
import { calcBlockTime, getDynGlobalObject, getGlobalObject } from '../blockchain/utils/miscellaneous';
import { getStoredCurrentUser } from '../blockchain/auth/services';
import { TOKENS_IN_XOM } from '../../utils/constants';


const key = 'historyStorage';

class OmnicoinHistory extends BaseStorage {
  constructor(currentUser) {
    super(key, currentUser.username);
    this.currentUser = currentUser;
    this.cache = this.getData();
    if (!this.cache) {
      this.init();
      this.cache = {};
    }
  }

  getOperation(id) {
    return this.cache[id];
  }

  exists(id) {
    return !!this.cache[id];
  }

  isEscrowResult(op) {
    return op.operationType === ChainTypes.operations.escrow_release_operation
        || op.operationType === ChainTypes.operations.escrow_return_operation;
  }

  operationAmount(op) {
    if (op.amount) {
      return op.amount;
    }
    if (this.isEscrowResult(op)) {
      const escrowTr = this.findEscrowTransactionByResult(op);
      return escrowTr.amount;
    }
    return 0;
  }

  operationMemo(op) {
    if (op.memo) {
      return op.memo;
    } else if (this.isEscrowResult(op)) {
      const escrowTr = this.findEscrowTransactionByResult(op);
      return escrowTr.memo;
    }
    return '';
  }

  getObFee(op) {
    if (this.isEscrowResult(op)) {
      return this.findEscrowTransactionByResult(op).obFee;
    }
    return op.obFee;
  }

  totalObFee(op) {
    let total = 0;
    const obFee = this.getObFee(op);
    if (obFee) {
      Object.keys(obFee).forEach(key => {
        total += obFee[key];
      });
    }
    return total;
  }

  processObFee(fee) {
    const out = {};
    if (fee) {
      Object.keys(fee).forEach(key => {
        out[key] = fee[key].amount / TOKENS_IN_XOM;
      });
    }
    return out;
  }

  addOperation(op) {
    this.cache[op.id] = op;
  }

  findEscrowTransactionByResult(op) {
    const filtered = Object.keys(this.cache).filter(i => this.cache[i].escrow === op.escrow && this.cache[i].operationType === ChainTypes.operations.escrow_create_operation);
    return this.cache[filtered[0]];
  }

  findEscrowTransactionResult(op) {
    const filtered = Object.keys(this.cache).filter(i =>
      (this.cache[i].escrow === op.escrow &&
        (this.cache[i].operationType === ChainTypes.operations.escrow_release_operation ||
          this.cache[i].operationType === ChainTypes.operations.escrow_return_operation)));
    return this.cache[filtered[0]];
  }

  //checks if publisher and user is not a publisher himself
  isPublisherListingRelatedOp(op) {
    return  (op.to === this.currentUser.username && op.to !== op.from) && (
      op.operationType === ChainTypes.operations.listing_create_operation
      || op.operationType === ChainTypes.operations.listing_update_operation
      || op.operationType === ChainTypes.operations.listing_delete_operation
    );
  }

  includeOperation(op) {
    if (this.isPublisherListingRelatedOp(op)) {
      return false;
    }
    if (op.operationType === ChainTypes.operations.escrow_create_operation) {
      const result = this.findEscrowTransactionResult(op);
      return !result && (op.from === this.accountName || op.to === this.accountName);
    } else if (op.operationType === ChainTypes.operations.escrow_return_operation ||
      op.operationType === ChainTypes.operations.escrow_release_operation) {
      return op.from === this.accountName || op.to === this.accountName;
    }
    return true;
  }



  getHistory() {
    const transactions = {};
    Object.keys(this.cache).forEach(i => {
      if (!this.includeOperation(this.cache[i])) {
        return;
      }
      const op = this.cache[i];
      const trxKey = `${op.blockNum}${op.trxInBlock}`;
      if (!transactions[trxKey]) {
        transactions[trxKey] = {
          amount: 0,
          fee: 0,
          //   balance: 0,
          operations: [],
          type: op.operationType
        };
      }
      if (op.opInTrx === 0) {
        transactions[trxKey] = {
          ...op,
          ...transactions[trxKey]
        };
      }
      const totalObFee = this.totalObFee(op);
      if (op.isIncoming) {
        transactions[trxKey].amount += this.operationAmount(op);
      } else {
        transactions[trxKey].amount -= this.operationAmount(op);
      }

      // when user is publishing listings on his own publisher node
      if (op.from === op.to) {
        transactions[trxKey].fee += op.fee + totalObFee;
      } else if (op.to === this.currentUser.username) {
        if (op.operationType === ChainTypes.operations.listing_create_operation
            || op.operationType === ChainTypes.operations.listing_update_operation
            || op.operationType === ChainTypes.operations.transfer) {
          transactions[trxKey].fee += totalObFee;
        }
      } else if (op.from === this.currentUser.username) {
        transactions[trxKey].fee += op.fee;
        if (op.operationType !== ChainTypes.operations.transfer
            && op.operationType !== ChainTypes.operations.listing_create_operation
            && op.operationType !== ChainTypes.operations.listing_update_operation) {
          transactions[trxKey].fee += totalObFee;
        } else {
          transactions[trxKey].fee += op.obFee.publisher_fee || 0;
        }
      }
      transactions[trxKey].memo = this.operationMemo(op);
      let obFee;
      if (op.operationType === ChainTypes.operations.listing_create_operation
          || op.operationType === ChainTypes.operations.listing_update_operation
          || op.operationType === ChainTypes.operations.transfer) {
        obFee = this.getObFee(op);
      }
      transactions[trxKey].operations.push({
        ...op,
        obFee,
        amount: this.operationAmount(op)
      });
    });
    return orderBy(Object.values(transactions), ['date'], ['desc']);
    // return HistoryStorage.updateBalances(sortedTransactions);
  }

  getListingPurchaseOperations() {
    return Object.keys(this.cache)
      .map(key => this.cache[key])
      // looking for operations containing Listing ID
      .filter(op => op.operationType === ChainTypes.operations.transfer
        || op.operationType === ChainTypes.operations.escrow_create_operation)
      .filter(op => !!op.listingId)
      // Replacing escrow_create with escrow_release if there was a release
      .map(op => {
        if (op.operationType === ChainTypes.operations.escrow_create_operation) {
          const result = this.findEscrowTransactionResult(op);
          if (result && result.operationType === ChainTypes.operations.escrow_release_operation) {
            return {
              ...result,
              listingId: op.listingId,
              listingCount: op.listingCount
            };
          }
        }
        return op;
      })
      // throwing away unreleased escrow_create operations
      .filter(op => op.operationType !== ChainTypes.operations.escrow_create_operation);
  }

  getBuyOperations() {
    const operations = this.getListingPurchaseOperations();
    return operations
      .filter(op => !op.isIncoming)
      .map(op => ({
        key: op.id,
        id: op.listingId,
        count: op.listingCount,
        date: op.date,
      }));
  }

  getSellOperations() {
    const operations = this.getListingPurchaseOperations();
    return operations
      .filter(op => op.isIncoming)
      .map(op => ({
        key: op.id,
        id: op.listingId,
        count: op.listingCount,
        date: op.date,
      }));
  }


  async getListingObjects(operations) {
    const listingIds = operations.map(op => op.id);
    let listingObjects = await Apis.instance().db_api().exec('get_objects', [listingIds]);
    listingObjects = listingObjects.filter(listing => !!listing);
    listingObjects = await Promise.all(listingObjects.map(async el => await Promise.all([
      FetchChain('getAccount', el.seller),
      FetchChain('getAccount', el.publisher)
    ]).then(res => ({
      ...el,
      price: el.price.amount / TOKENS_IN_XOM,
      seller: res[0].get('name'),
      publisher: res[1].get('name')
    }))));
    return listingObjects;
  }
  async getBuyHistory() {
    const buyOperations = this.getBuyOperations();
    const listingObjects = await this.getListingObjects(buyOperations);
    return buyOperations.map(op => {
      const item = listingObjects.find(item => item.id === op.id);
      return {
        ...item,
        ...op,
      };
    });
  }

  async getSellHistory() {
    const sellOperations = this.getSellOperations();
    const listingObjects = await this.getListingObjects(sellOperations);
    return sellOperations.map(op => {
      const item = listingObjects.find(item => item.id === op.id);
      return {
        ...item,
        ...op,
      };
    });
  }

  save() {
    super.save(this.cache);
  }

  clear() {
    this.cache = {};
    this.save();
  }

  static async getParties(op) {
    switch (op[0]) {
      case ChainTypes.operations.transfer:
        return await Promise.all([
          FetchChain('getAccount', op[1].from),
          FetchChain('getAccount', op[1].to)
        ]);
      case ChainTypes.operations.escrow_create_operation:
        return await Promise.all([
          FetchChain('getAccount', op[1].buyer),
          FetchChain('getAccount', op[1].seller)
        ]);
      case ChainTypes.operations.escrow_release_operation:
        return await Promise.all([
          FetchChain('getAccount', op[1].buyer_account),
          FetchChain('getAccount', op[1].seller_account || op[1].fee_paying_account)
        ]);
      case ChainTypes.operations.escrow_return_operation:
        return await Promise.all([
          FetchChain('getAccount', op[1].buyer_account || op[1].fee_paying_account),
          FetchChain('getAccount', op[1].seller_account)
        ]);
    }
  }

  async refresh() {
    const activeKey = generateKeyFromPassword(this.currentUser.username, 'active', this.currentUser.password);
    const [account, globalObject, dynGlobalObject] = await Promise.all([
      FetchChain('getAccount', this.currentUser.username),
      getGlobalObject(),
      getDynGlobalObject()
    ]);
    console.log('DYN GLOBAL OBJECT ', dynGlobalObject);
    const result = await ChainStore.fetchRecentHistory(account.get('id'));
    let history = [];
    const h = result.get('history');
    const seenOps = new Set();
    history = history.concat(h.toJS().filter(op => !seenOps.has(op.id) && seenOps.add(op.id)));
    history = history.filter(el => [
      ChainTypes.operations.transfer,
      ChainTypes.operations.escrow_create_operation,
      ChainTypes.operations.escrow_release_operation,
      ChainTypes.operations.escrow_return_operation,
      ChainTypes.operations.account_update,
      ChainTypes.operations.listing_create_operation,
      ChainTypes.operations.listing_update_operation,
      ChainTypes.operations.listing_delete_operation,
      ChainTypes.operations.welcome_bonus_operation,
      ChainTypes.operations.referral_bonus_operation,
      ChainTypes.operations.sale_bonus_operation,
      ChainTypes.operations.witness_bonus_operation,
      ChainTypes.operations.witness_create,
    ].includes(el.op[0]));
    for (let i = 0; i < history.length; ++i) {
      const el = history[i];
      if (!this.exists(el.id)) {
        if (el.op[0] === ChainTypes.operations.welcome_bonus_operation
            || el.op[0] === ChainTypes.operations.sale_bonus_operation
            || el.op[0] === ChainTypes.operations.witness_bonus_operation) {
          const operation = {
            id: el.id,
            blockNum: el.block_num,
            opInTrx: el.op_in_trx,
            trxInBlock: el.trx_in_block,
            date: calcBlockTime(el.block_num, globalObject, dynGlobalObject).getTime(),
            fee: el.op[1].fee.amount / TOKENS_IN_XOM,
            obFee: this.processObFee(el.op[1].ob_fee),
            operationType: el.op[0],
            amount: el.result[1].amount / TOKENS_IN_XOM,
            isIncoming: true
          };
          if ((operation.operationType === ChainTypes.operations.sale_bonus_operation
                && el.op[1].seller === account.get('id'))
              || operation.operationType === ChainTypes.operations.welcome_bonus_operation
              || operation.operationType === ChainTypes.operations.witness_bonus_operation) {
            this.addOperation(operation);
          }
        } else if (el.op[0] === ChainTypes.operations.referral_bonus_operation) {
          if (el.op[1].referred_account !== account.get('id')) {
            const [referredAcc, referrerAcc] = await Promise.all([
              FetchChain('getAccount', el.op[1].referred_account),
              FetchChain('getAccount', el.op[1].referrer_account)
            ]);
            this.addOperation({
              id: el.id,
              blockNum: el.block_num,
              opInTrx: el.op_in_trx,
              trxInBlock: el.trx_in_block,
              date: calcBlockTime(el.block_num, globalObject, dynGlobalObject).getTime(),
              fee: el.op[1].fee.amount / TOKENS_IN_XOM,
              obFee: this.processObFee(el.op[1].ob_fee),
              operationType: el.op[0],
              amount: el.result[1].amount / TOKENS_IN_XOM,
              from: referrerAcc.get('name'),
              to: referredAcc.get('name'),
              fromTo: referredAcc.get('name'),
              isIncoming: true
            });
          }
        } else if ([ChainTypes.operations.listing_create_operation,
          ChainTypes.operations.listing_update_operation,
          ChainTypes.operations.listing_delete_operation,
          ChainTypes.operations.witness_create,
          ChainTypes.operations.account_update].includes(el.op[0])) {
          const operation = {
            id: el.id,
            blockNum: el.block_num,
            opInTrx: el.op_in_trx,
            trxInBlock: el.trx_in_block,
            date: calcBlockTime(el.block_num, globalObject, dynGlobalObject).getTime(),
            fee: el.op[1].fee.amount / TOKENS_IN_XOM,
            obFee: this.processObFee(el.op[1].ob_fee),
            operationType: el.op[0],
            isIncoming: false
          };
          if ([ChainTypes.operations.listing_create_operation,
               ChainTypes.operations.listing_update_operation].includes(el.op[0])) {
            const [publisher, seller] = await Promise.all([
              FetchChain('getAccount', el.op[1].publisher),
              FetchChain('getAccount', el.op[1].seller)
            ]);
            operation.from = seller.get('name');
            operation.to = publisher.get('name');
            operation.fromTo = this.currentUser.username === seller.get('name')
              ? publisher.get('name')
              : seller.get('name');
            if (operation.from === operation.to) {
              operation.isIncoming = false;
            } else if (el.op[1].publisher === account.get('id')) {
              operation.isIncoming = true;
            }
          }
          this.addOperation(operation);
        } else {
          const [from, to] = await OmnicoinHistory.getParties(el.op);
          this.addOperation({
            id: el.id,
            blockNum: el.block_num,
            opInTrx: el.op_in_trx,
            trxInBlock: el.trx_in_block,
            date: calcBlockTime(el.block_num, globalObject, dynGlobalObject).getTime(),
            fromTo: from.get('name') === this.currentUser.username ? to.get('name') : from.get('name'),
            from: from.get('name'),
            to: to.get('name'),
            memo: el.op[1].memo ? decodeMemo(el.op[1].memo, activeKey) : null,
            amount: el.op[1].amount ? el.op[1].amount.amount / TOKENS_IN_XOM : 0,
            fee: el.op[1].fee.amount / TOKENS_IN_XOM,
            obFee: this.processObFee(el.op[1].ob_fee),
            operationType: el.op[0],
            // will be undefined if operation type is transfer
            escrow: el.op[0] === ChainTypes.operations.escrow_create_operation
              ? el.result[1]
              : el.op[1].escrow,
            listingId: el.op[1].listing,
            listingCount: el.op[1].listing_count,
            isIncoming: from.get('name') !== this.currentUser.username
          });
        }
      }
    }
    this.save();
  }
}

export default OmnicoinHistory;
