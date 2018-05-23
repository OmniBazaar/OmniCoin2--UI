class BaseStorage {
  constructor(key, accountName) {
    this.key = key;
    this.accountName = accountName;
  }

  getKey() {
    return this.key + this.accountName;
  }

  init(withValue = {}) {
    localStorage.setItem(this.getKey(), JSON.stringify(withValue));
  }

  getData() {
    return JSON.parse(localStorage.getItem(this.getKey()));
  }

  save(data) {
    localStorage.setItem(this.getKey(), JSON.stringify(data));
  }

  clear() {
    localStorage.setItem(this.getKey(), null);
  }
}

export default BaseStorage;
