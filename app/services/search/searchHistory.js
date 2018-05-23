const key = "searchHistory";

import BaseStorage from '../../utils/baseStorage';

class SearchHistory extends BaseStorage {
    constructor(accountName) {
      super(key, accountName);
      this.clear();
      this.cache = this.getData();
      if (!this.cache) {
        this.init([]);
        this.cache = [];
      }
    }

    add(historyItem) {
      const withDate = {
        ...historyItem,
        date: new Date()
      };
      console.log('CACHE ', this.cache);
      this.cache.push(withDate);
      this.save(withDate);
    }

    getHistory() {
      return this.cache;
    }
}

export default SearchHistory;
