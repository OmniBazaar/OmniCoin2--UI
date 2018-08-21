import BaseStorage from '../../utils/baseStorage';

const key = 'bitcoinHistory';


class BitcoinObFeesHistory extends BaseStorage {
  constructor(currentUser) {
    super(key, currentUser.username);
    this.currentUser = currentUser;
    this.cache = this.getData();
    if (!this.cache) {
      this.init([]);
      this.cache = [];
    }
  }

  add(detail) {
    this.cache.push(detail);
    this.save(this.cache);
  }

  getTxInfo(hash) {
    return this.cache.find(el => el.hash === hash);
  }
}

export default BitcoinObFeesHistory;
