import dateformat from 'dateformat';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';

const key = 'searchHistory';
const map = {};
import BaseStorage from '../../utils/baseStorage';

class SearchHistory extends BaseStorage {
  constructor(accountName) {
    super(key, accountName);
    if (map[accountName]) {
      this.cache = map[accountName];
    }
    this.cache = this.getData();
    if (!this.cache) {
      this.init([]);
      this.cache = [];
    }
    map[accountName] = this.cache;
  }

  add(historyItem) {
    const withDate = {
      ...historyItem,
      date: new Date().getTime(),
      id: uuidv4(),
      saved: false
    };
    this.cache.push(withDate);
    this.save(this.cache);
  }

  getHistory() {
    return _.orderBy(this.cache, ['date'], ['desc']);
  }

  getSavedHistory() {
    return _.orderBy(this.cache.filter(el => el.saved), ['date'], ['desc']);
  }

  saveSearch(id) {
    this.cache = this.cache.map(el => ({
      ...el,
      saved: el.id === id ? true : el.saved
    }));
    this.save(this.cache);
  }

  unsaveSearch(id) {
    this.cache = this.cache.map(el => ({
      ...el,
      saved: el.id === id ? false : el.saved
    }));
    this.save(this.cache);
  }
}

export default SearchHistory;
