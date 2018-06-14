import { orderBy, zip, uniqBy } from 'lodash';
import {FetchChain, ChainStore, ChainTypes} from 'omnibazaarjs/es';
import { Apis } from 'omnibazaarjs-ws';

import BaseStorage from '../../utils/baseStorage';
import {decodeMemo, generateKeyFromPassword} from "../blockchain/utils/wallet";
import {calcBlockTime, getDynGlobalObject, getGlobalObject} from "../blockchain/utils/miscellaneous";


const key = 'historyStorage';

class HistoryStorage extends BaseStorage {
  constructor(accountName) {
    super(key, accountName);
    this.cache = this.getData();
    if (!this.cache) {
      this.init();
      this.cache = {};
    }
  }

  static OperationTypes = Object.freeze({
    withdraw: 'withdraw',
    deposit: 'deposit'
  });


  // static updateBalances(transactions) {
  //   if (transactions.length) {
  //     transactions[transactions.length - 1].balance = transactions[transactions.length - 1].amount;
  //     for (let i = transactions.length - 2; i >= 0; --i) {
  //       transactions[i].balance = transactions[i + 1].balance
  //                                 + transactions[i].balance
  //                                 + transactions[i].amount;
  //       transactions[i].amount = Math.abs(transactions[i].amount);
  //     }
  //   }
  //   return transactions;
  // }

  getOperation(id) {
    return this.cache[id];
  }

  exists(id) {
    return !!this.cache[id];
  }

  operationAmount(op) {
    if (op.amount) {
      return op.amount;
    }
    if (op.operationType === ChainTypes.operations.escrow_release_operation
      || op.operationType === ChainTypes.operations.escrow_return_operation) {
      const escrowTr = this.findEscrowTransactionByResult(op);
      return escrowTr.amount;
    }
    return 0;
  }

  operationMemo(op) {
    if (op.memo) {
      return op.memo;
    } else if (op.operationType === ChainTypes.operations.escrow_release_operation
      || op.operationType === ChainTypes.operations.escrow_return_operation) {
      const escrowTr = this.findEscrowTransactionByResult(op);
      return escrowTr.memo;
    }
    return '';
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

  includeOperation(op) {
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
      if (op.type === HistoryStorage.OperationTypes.deposit) {
        transactions[trxKey].amount += this.operationAmount(op);
      } else if (op.type === HistoryStorage.OperationTypes.withdraw) {
        transactions[trxKey].amount -= this.operationAmount(op);
      }
      transactions[trxKey].fee += op.fee;

      transactions[trxKey].memo = this.operationMemo(op);
      transactions[trxKey].operations.push({
        ...op,
        amount: this.operationAmount(op)
      });
    });
    return orderBy(Object.values(transactions), ['date'], ['desc']);
    // return HistoryStorage.updateBalances(sortedTransactions);
  }

  async getBuyHistory() {
    let listings = Object.keys(this.cache)
      .map(key => this.cache[key])
      .filter(op => !!op.listingId)
      .map(op => ({
        key: op.id,
        id: op.listingId,
        count: op.listingCount,
        date: op.date,
      }));
    const listingIds = listings.map(listing => listing.id);
    let listingObjects = await Apis.instance().db_api().exec('get_objects', [listingIds]);
    listingObjects = await Promise.all(
      listingObjects.map(async el => await Promise.all([
        FetchChain('getAccount', el.seller),
        FetchChain('getAccount', el.publisher)
      ]).then(res => {
        return {
          ...el,
          price: el.price.amount / 100000,
          seller: res[0].get('name'),
          publisher: res[1].get('name')
        }
      }))
    );
    const mapped = listingObjects.map(listing => {
      const item = listings.find(item => item.id === listing.id);
      return {
        ...listing,
        count: item.count,
        date: item.date,
        key: item.key,
      }
    });
    return uniqBy(mapped, 'key');
  }

  save() {
    super.save(this.cache);
  }

  clear() {
    this.cache = {};
    localStorage.setItem(key + this.accountName, JSON.stringify({}));
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

  async refresh(currentUser) {
    const activeKey = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
    const [account, globalObject, dynGlobalObject] = await Promise.all([
      FetchChain('getAccount', currentUser.username),
      getGlobalObject(),
      getDynGlobalObject()
    ]);
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
    ].includes(el.op[0]));
    for (let i = 0; i < history.length; ++i) {
      const el = history[i];
      if (!this.exists(el.id)) {
        if (el.op[0] === ChainTypes.operations.welcome_bonus_operation) {
          console.log('WELCOME BONUS ', JSON.stringify(el, null, 2));
          console.log('AMOUNT ', el.op[1].amount);
          this.addOperation({
            id: el.id,
            blockNum: el.block_num,
            opInTrx: el.op_in_trx,
            trxInBlock: el.trx_in_block,
            date: calcBlockTime(el.block_num, globalObject, dynGlobalObject).toString(),
            fee: el.op[1].fee.amount / 100000,
            operationType: el.op[0],
            amount: el.result[1].amount / 100000,
            type: HistoryStorage.OperationTypes.deposit
          });
        } else if (el.op[0] === ChainTypes.operations.referral_bonus_operation) {
          this.addOperation({
            id: el.id,
            blockNum: el.block_num,
            opInTrx: el.op_in_trx,
            trxInBlock: el.trx_in_block,
            date: calcBlockTime(el.block_num, globalObject, dynGlobalObject).toString(),
            fee: el.op[1].fee.amount / 100000,
            operationType: el.op[0],
            amount: el.result[1].amount / 100000,
            type: HistoryStorage.OperationTypes.deposit
          });
        } else if ([ChainTypes.operations.listing_create_operation,
              ChainTypes.operations.listing_update_operation,
              ChainTypes.operations.listing_delete_operation,
              ChainTypes.operations.account_update].includes(el.op[0])) {
          this.addOperation({
            id: el.id,
            blockNum: el.block_num,
            opInTrx: el.op_in_trx,
            trxInBlock: el.trx_in_block,
            date: calcBlockTime(el.block_num, globalObject, dynGlobalObject).toString(),
            fee: el.op[1].fee.amount / 100000,
            operationType: el.op[0],
          });
        } else {
          const [from, to] = await HistoryStorage.getParties(el.op);
          this.addOperation({
            id: el.id,
            blockNum: el.block_num,
            opInTrx: el.op_in_trx,
            trxInBlock: el.trx_in_block,
            date: calcBlockTime(el.block_num, globalObject, dynGlobalObject).toString(),
            fromTo: from.get('name') === currentUser.username ? to.get('name') : from.get('name'),
            from: from.get('name'),
            to: to.get('name'),
            memo: el.op[1].memo ? decodeMemo(el.op[1].memo, activeKey) : null,
            amount: el.op[1].amount ? el.op[1].amount.amount / 100000 : 0,
            fee: el.op[1].fee.amount / 100000,
            type: from.get('name') === currentUser.username
              ? HistoryStorage.OperationTypes.withdraw
              : HistoryStorage.OperationTypes.deposit,
            operationType: el.op[0],
            // will be undefined if operation type is transfer
            escrow: el.op[0] === ChainTypes.operations.escrow_create_operation
              ? el.result[1]
              : el.op[1].escrow,
            listingId: el.op[1].listing,
            listingCount: el.op[1].listing_count,
          });
        }
      }
    }
    this.save();
  }
}

export default HistoryStorage;
