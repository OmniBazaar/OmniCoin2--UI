import {
  all,
  call,
  put,
  takeEvery,
  select
} from 'redux-saga/effects';

import {
  getSavedSearchesSucceeded,
  getSavedSearchesFailed,
  getRecentSearchesSucceeded,
  getRecentSearchesFailed,
  deleteSearchSucceeded,
  deleteSearchFailed,
  saveSearchSucceeded,
  saveSearchFailed,
  searching
} from './searchActions';
import SearchHistory from './searchHistory';
import {getNewId, messageTypes, ws} from "../marketplace/wsSaga";

const searchByAllKeywords = false; //todo


export function* searchSubscriber() {
  yield all([
    takeEvery('SEARCH_LISTINGS', searchListings),
    takeEvery('GET_RECENT_SEARCHES', getRecentSearches),
    takeEvery('GET_SAVED_SEARCHES', getSavedSearches),
    takeEvery('SAVE_SEARCH', saveSearch),
    takeEvery('DELETE_SEARCH', deleteSearch)
  ]);
}

function* searchListings({ payload: { searchTerm, category, country, city, historify } }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    if (historify) {
      const searchHistory = new SearchHistory(currentUser.username);
      searchHistory.add({ searchTerm, category });
    }
    yield put({ type: 'GET_RECENT_SEARCHES', payload: { username: currentUser.username } });
    yield put({ type: 'DHT_GET_PEERS_FOR', payload: { searchTerm, category, country, city, searchListings: true } });
  } catch (e) {
    console.log('ERROR ', e);
    yield put({ type: 'SEARCH_LISTINGS_FAILED', error: e.message });
  }
}

export function* searchListingsByPeersMap({ payload: { peersMap, category, country, city }}) {
    let message;
    const id = getNewId();
    if (searchByAllKeywords) {
      message = {
        id,
        type: messageTypes.MARKETPLACE_SEARCH_BY_ALL_KEYWORDS_DATA_RECEIVED,
        command: {
          keywords: peersMap.reduce((keywords, curr) => [...keywords, curr.keyword], []),
          publishers: peersMap.reduce((publishers, curr) => [...publishsers, curr.publishers], []),
          currency: "BTC",
          range: "20",
        },
      };
    } else {
      message = {
        id,
        type: messageTypes.MARKETPLACE_SEARCH_BY_ANY_KEYWORD_DATA_RECEIVED,
        command: {
          keywords: peersMap,
          currency: "BTC",
          range: "20",
        },
      };
    }
    if (category) {
      message.category = category;
    }
    if (city) {
      message.city = city;
    }
    if (country) {
      message.country = country;
    }
    ws.send(JSON.stringify(message));
    yield put(searching(id));
}

function* getRecentSearches() {
  try {
    const { currentUser } = (yield select()).default.auth;
    const searches = yield call(async () => {
      const history = new SearchHistory(currentUser.username);
      return history.getHistory();
    });
    yield put(getRecentSearchesSucceeded(searches));
  } catch (error) {
    console.log('ERROR ', error);
    yield put(getRecentSearchesFailed(error));
  }
}

function* getSavedSearches() {
  try {
    const { currentUser } = (yield select()).default.auth;
    const searches = yield call(async () => {
      const history = new SearchHistory(currentUser.username);
      return history.getSavedHistory();
    });
    yield put(getSavedSearchesSucceeded(searches));
  } catch (error) {
    console.log('ERROR ', error);
    yield put(getSavedSearchesFailed(error));
  }
}

function* saveSearch({ payload: { search } }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const recentSearches = yield call(async () => {
      const history = new SearchHistory(currentUser.username);
      history.saveSearch(search.id);
      return history.getHistory();
    });
    yield put(saveSearchSucceeded(recentSearches));
  } catch (error) {
    console.log('ERROR ', error);
    yield put(saveSearchFailed(error));
  }
}

function* deleteSearch({ payload: { search } }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const savedSearches = yield call(async () => {
      const history = new SearchHistory(currentUser.username);
      history.unsaveSearch(search.id);
      return history.getSavedHistory();
    });
    yield put(deleteSearchSucceeded(savedSearches));
  } catch (error) {
    console.log('ERROR ', error);
    yield put(deleteSearchFailed(error));
  }
}

