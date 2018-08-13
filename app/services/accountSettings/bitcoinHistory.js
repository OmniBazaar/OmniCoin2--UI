import BaseStorage from '../../utils/baseStorage';

const key = 'bitcoinHistory';

export const Statuses = {
  omnibazaarFee: 0,
  referrerFee: 1,
  purchase: 3
};

class BitcoinPurchaseHistory extends BaseStorage {
  constructor(currentUser) {
    super(key, currentUser.username);
    this.currentUser = currentUser;
    this.cache = this.getData();
    if (!this.cache) {
      this.init();
      this.cache = {};
    }
  }

  addTransaction(transaction) {

  }
}

export default BitcoinPurchaseHistory;
