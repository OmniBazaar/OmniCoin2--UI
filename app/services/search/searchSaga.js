import {
  all,
  call,
  put,
  takeEvery,
  select
} from 'redux-saga/effects';

import SearchHistory from './searchHistory';

export function* searchSubscriber() {
  yield all([
    takeEvery('SEARCH_LISTINGS', searchListings),
  ]);
}

export function* searchListings({payload: { searchTerm, category }}) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const searchHistory = new SearchHistory(currentUser.username);
    searchHistory.add({searchTerm, category});
    yield put({type: 'DHT_GET_PEERS_FOR', payload: {searchTerm, category}})
  } catch (e) {
    console.log('ERROR ', e);
    yield put({ type: 'SEARCH_LISTINGS_FAILED', error: e.message });
  }
}
