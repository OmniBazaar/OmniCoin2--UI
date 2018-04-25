import { orderBy } from 'lodash';

const key = 'historyStorage';

class HistoryStorage {
  constructor(accountName) {
    this.accountName = accountName;
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

  init() {
    localStorage.setItem(key + this.accountName, JSON.stringify({}));
  }

  getData() {
    return JSON.parse(localStorage.getItem(key + this.accountName));
  }

  static updateBalances(transactions) {
    if (transactions.length) {
      transactions[transactions.length - 1].balance = transactions[transactions.length - 1].amount;
      for (let i = transactions.length - 2; i >= 0; --i) {
        transactions[i].balance = transactions[i + 1].balance
                                  + transactions[i].balance
                                  + transactions[i].amount;
        transactions[i].amount = Math.abs(transactions[i].amount);
      }
    }
    return transactions;
  }

  getOperation(id) {
    return this.cache[id];
  }

  exists(id) {
    return !!this.cache[id];
  }

  addOperation(op) {
    this.cache[op.id] = op;
  }

  getHistory() {
    const transactions = {};
    Object.keys(this.cache).forEach(i => {
      const op = this.cache[i];
      const trxKey = `${op.blockNum}${op.trxInBlock}`;
      if (!transactions[trxKey]) {
        transactions[trxKey] = {
          amount: 0,
          fee: 0,
          balance: 0,
          operations: [],
        };
      }
      if (op.opInTrx === 0) {
        transactions[trxKey] = {
          ...op,
          ...transactions[trxKey]
        };
      }
      if (op.type === HistoryStorage.OperationTypes.deposit) {
        transactions[trxKey].amount += op.amount;
      } else {
        transactions[trxKey].amount -= op.amount;
      }
      if (op.type === HistoryStorage.OperationTypes.withdraw) {
        transactions[trxKey].fee += op.fee;
        transactions[trxKey].balance -= op.fee;
      }
      transactions[trxKey].operations.push(op);
    });
    const sortedTransactions = orderBy(Object.values(transactions), ['date'], ['desc']);
    return HistoryStorage.updateBalances(sortedTransactions);
  }

  save() {
    localStorage.setItem(key + this.accountName, JSON.stringify(this.cache));
  }
}

export default HistoryStorage;
