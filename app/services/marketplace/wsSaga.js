import {
  call,
  take,
  put,
} from 'redux-saga/effects';
import ReconnectingWebSocket from 'reconnecting-websocket';

import { wsWatcher } from '../utils';

const key = 'ob2CommandId';

export const ws = new ReconnectingWebSocket('ws://127.0.0.1:8098');

export const messageTypes = {
  MARKETPLACE_NULL: '0',
  MARKETPLACE_SEARCH_BY_ALL_KEYWORDS: '1',
  MARKETPLACE_SEARCH_BY_ANY_KEYWORD: '2',
  MARKETPLACE_RETURN_BOOL: '3',
  MARKETPLACE_RETURN_LISTINGS: '4',
  MARKETPLACE_GET_LISTING: '5',
};

export const getNewId = () => {
  const id = localStorage.getItem(key);
  if (!id) {
    localStorage.setItem(key, 1);
    return 1;
  }
  localStorage.setItem(key, parseInt(id) + 1);
  return (parseInt(id) + 1);
};

export function* wsMarketplaceSubscriber() {
  const channel = yield call(wsWatcher, ws, messageTypes);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}
