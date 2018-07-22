import BaseStorage from '../../utils/baseStorage';

const key = 'ethereumHistory';

class EthereumHistory extends BaseStorage {
  constructor(accountName) {
    super(key, accountName);
    this.cache = this.getData();
    if (!this.cache) {
      this.init();
      this.cache = {};
    }
  }

  addOperation(op) {
    this.cache[op.id] = op;
  }

  save() {
    super.save(this.cache);
  }

  getHistory() {
    return [];
  }
}

export default EthereumHistory;
