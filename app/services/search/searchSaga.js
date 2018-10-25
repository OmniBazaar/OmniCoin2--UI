import {
  all,
  call,
  put,
  takeEvery,
  select
} from 'redux-saga/effects';
import { uniq, uniqBy } from 'lodash';

import {
  getSavedSearchesSucceeded,
  getSavedSearchesFailed,
  getRecentSearchesSucceeded,
  getRecentSearchesFailed,
  deleteSearchSucceeded,
  deleteSearchFailed,
  saveSearchSucceeded,
  saveSearchFailed,
  searching,
  setSearchListingsParams,
  searchResultEmpty
} from './searchActions';
import { clearMyListings } from '../listing/listingActions';
import SearchHistory from './searchHistory';
import { getNewId, messageTypes, ws } from '../marketplace/wsSaga';
import { searchPeers } from './dht/dhtSaga';
import { getPreferences } from '../preferences/services';


export const CATEGORY_IGNORED = ['all', 'featuredlistings'];
export const SUBCATEGORY_IGNORED = ['all'];

export function* searchSubscriber() {
  yield all([
    takeEvery('SEARCH_LISTINGS', searchListings),
    takeEvery('GET_RECENT_SEARCHES', getRecentSearches),
    takeEvery('GET_SAVED_SEARCHES', getSavedSearches),
    takeEvery('SAVE_SEARCH', saveSearch),
    takeEvery('DELETE_SEARCH', deleteSearch)
  ]);
}

function* obSearch({
  searchId, dhtResult, searchTerm, category, subCategory,
  country, state, city, isSearchByAllKeywords
}) {
  let message;
  const filters = [];

  if (category && CATEGORY_IGNORED.indexOf(category.toLowerCase()) === -1) {
    filters.push({
      op: '=',
      name: 'category',
      value: category,
    });
  }

  if (subCategory && SUBCATEGORY_IGNORED.indexOf(subCategory.toLowerCase()) === -1) {
    filters.push({
      op: '=',
      name: 'subcategory',
      value: subCategory,
    });
  }

  if (country) {
    filters.push({
      op: '=',
      name: 'country',
      value: country,
    });
  }

  if (state) {
    filters.push({
      op: '=',
      name: 'state',
      value: state,
    });
  }

  if (city) {
    filters.push({
      op: '=',
      name: 'city',
      value: city,
    });
  }

  isSearchByAllKeywords = isSearchByAllKeywords || !dhtResult.keywords.length;
  const type = (
    isSearchByAllKeywords ?
    messageTypes.MARKETPLACE_SEARCH_BY_ALL_KEYWORDS :
    messageTypes.MARKETPLACE_SEARCH_BY_ANY_KEYWORD
  );

  message = {
    id: searchId,
    type,
    command: {
      currency: 'BTC',
      range: '20',
      filters,
      ...dhtResult
    }
  };

  console.log({search: message});

  ws.send(JSON.stringify(message));
}

function* searchListings({
  payload: {
    searchTerm, category, country, state, city, historify, subCategory, fromSearchMenu
  }
}) {
  try {
    const searchId = getNewId();
    yield put(searching(searchId, searchTerm, category, subCategory, fromSearchMenu));

    const { saving } = (yield select()).default.listing.saveListing;
    if (saving) {
      yield put(setSearchListingsParams(searchTerm, category, country, state, city, historify, subCategory, fromSearchMenu));
      return;
    }

    yield put(clearMyListings());
    const { currentUser } = (yield select()).default.auth;
    if (historify) {
      const searchHistory = new SearchHistory(currentUser.username);
      searchHistory.add({ searchTerm, category, subCategory });
    }
    yield put({ type: 'GET_RECENT_SEARCHES', payload: { username: currentUser.username } });

    const { searchListingOption } = getPreferences();
    const isSearchByAllKeywords = searchListingOption && searchListingOption === 'allKeywords';

    const dhtResult = yield searchPeers({
      searchTerm, category, subCategory, country, state, city, isSearchByAllKeywords
    });

    if (!dhtResult) {
      yield put(searchResultEmpty(searchId));
      return;
    }

    yield obSearch({
      searchId, dhtResult, searchTerm, category, subCategory,
      country, state, city, isSearchByAllKeywords, fromSearchMenu
    });
  } catch (e) {
    console.log('ERROR ', e);
    yield put({ type: 'SEARCH_LISTINGS_FAILED', error: e.message });
  }
}

// function* searchListingsOld({
//   payload: {
//     searchTerm, category, country, state, city, historify, subCategory, fromSearchMenu
//   }
// }) {
//   try {
//     const { saving } = (yield select()).default.listing.saveListing;
//     if (saving) {
//       yield put(setSearchListingsParams(searchTerm, category, country, state, city, historify, subCategory, fromSearchMenu));
//       return;
//     }

//     yield put(clearMyListings());
//     const { currentUser } = (yield select()).default.auth;
//     if (historify) {
//       const searchHistory = new SearchHistory(currentUser.username);
//       searchHistory.add({ searchTerm, category, subCategory });
//     }
//     yield put({ type: 'GET_RECENT_SEARCHES', payload: { username: currentUser.username } });
//     yield put({
//       type: 'DHT_GET_PEERS_FOR',
//       payload: {
//         searchTerm,
//         category,
//         country,
//         state,
//         city,
//         searchListings: true,
//         subCategory,
//         fromSearchMenu,
//       }
//     });
//   } catch (e) {
//     console.log('ERROR ', e);
//     yield put({ type: 'SEARCH_LISTINGS_FAILED', error: e.message });
//   }
// }

// export function* searchListingsByPeersMap({
//   payload: {
//     peersMap, category, country, state, city, subCategory, searchByAllKeywords, searchTerm, fromSearchMenu
//   }
// }) {
//   let message;
//   const id = getNewId();
//   const filters = [];

//   if (category && category !== 'All' && category !== 'featuredListings') {
//     filters.push({
//       op: '=',
//       name: 'category',
//       value: category,
//     });
//   }

//   if (subCategory && subCategory !== 'all') {
//     filters.push({
//       op: '=',
//       name: 'subcategory',
//       value: subCategory,
//     });
//   }

//   if (country) {
//     filters.push({
//       op: '=',
//       name: 'country',
//       value: country,
//     });
//   }

//   if (state) {
//     filters.push({
//       op: '=',
//       name: 'state',
//       value: state,
//     });
//   }

//   if (city) {
//     filters.push({
//       op: '=',
//       name: 'city',
//       value: city,
//     });
//   }

//   if (searchByAllKeywords) {
//     let keywords = [];
//     if (searchTerm) {
//       keywords = searchTerm.split(' ');
//     }
//     message = {
//       id,
//       type: messageTypes.MARKETPLACE_SEARCH_BY_ALL_KEYWORDS,
//       command: {
//         keywords,
//         publishers: peersMap.reduce((publishers, curr) =>
//           uniqBy([...publishers, ...(curr.publishers || [])], ({ address }) => address), []),
//         currency: 'BTC',
//         range: '20',
//         filters
//       },
//     };
//   } else {
//     message = {
//       id,
//       type: messageTypes.MARKETPLACE_SEARCH_BY_ANY_KEYWORD,
//       command: {
//         keywords: peersMap,
//         currency: 'BTC',
//         range: '20',
//         filters
//       },
//     };
//   }

//   console.log({
//     peersMap, message
//   })

//   ws.send(JSON.stringify(message));
//   yield put(searching(id, searchTerm, category, subCategory, fromSearchMenu));
// }

function* getRecentSearches() {
  try {
    const { currentUser } = (yield select()).default.auth;
    const history = new SearchHistory(currentUser.username);
    const searches = history.getHistory();
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

