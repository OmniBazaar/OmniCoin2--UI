import {
  call,
  take,
  put,
} from 'redux-saga/effects';

import { wsWatcher } from '../utils';

const ws = new WebSocket('ws://127.0.0.1:8099');

const messageTypes = [
  {
    type: '0',
    action: 'MARKETPLACE_NULL'
  },
  {
    type: '1',
    action: 'MARKETPLACE_TAG_FAVORITE'
  },
  {
    type: '2',
    action: 'MARKETPLACE_UNTAG_FAVORITE'
  },
  {
    type: '3',
    action: 'MARKETPLACE_GET_FAVORITES'
  },
  {
    type: '4',
    action: 'MARKETPLACE_SEARCH_BY_ALL_KEYWORDS'
  },
  {
    type: '5',
    action: 'MARKETPLACE_SEARCH_BY_ANY_KEYWORD'
  }
];

export function* wsMarketplaceSaga() {
  const channel = yield call(wsWatcher, ws, messageTypes);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}
