import { orderBy } from 'lodash';
import { ChainTypes, FetchChain } from 'omnibazaarjs/es';

import BaseStorage from '../../utils/baseStorage';

const key = 'historyStorage';

class HistoryStorage extends BaseStorage{
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
      console.log(this.accountName, op.from, op.to);
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
      } else {
        transactions[trxKey].amount -= this.operationAmount(op);
      }
      if (op.type === HistoryStorage.OperationTypes.withdraw) {
        transactions[trxKey].fee += op.fee;
        // transactions[trxKey].balance -= op.fee;
      }
      transactions[trxKey].memo = this.operationMemo(op);
      transactions[trxKey].operations.push(op);
    });
    return orderBy(Object.values(transactions), ['date'], ['desc']);
    // return HistoryStorage.updateBalances(sortedTransactions);
  }

  save() {
    super.save(this.cache);
  }

  clear() {
    this.cache = {};
    localStorage.setItem(key + this.accountName, JSON.stringify({}));
  }
}

export default HistoryStorage;
