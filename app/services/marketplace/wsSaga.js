import {
  call,
  take,
  put,
} from 'redux-saga/effects';

import { wsWatcher } from '../utils';

export const ws = new WebSocket('ws://127.0.0.1:8099');

export const messageTypes = {
  MARKETPLACE_NULL_DATA_RECEIVED: '0',
  MARKETPLACE_SEARCH_BY_ALL_KEYWORDS_DATA_RECEIVED: '1',
  MARKETPLACE_SEARCH_BY_ANY_KEYWORD_DATA_RECEIVED: '2',
  MARKETPLACE_RETURN_BOOL: '3',
  MARKETPLACE_RETURN_LISTINGS: '4',
  MARKETPLACE_GET_LISTING: '5',
};

  export function* wsMarketplaceSubscriber() {
  const channel = yield call(wsWatcher, ws, messageTypes);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}