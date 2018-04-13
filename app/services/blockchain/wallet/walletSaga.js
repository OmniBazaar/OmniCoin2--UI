import {
  takeEvery,
  put,
  all
} from 'redux-saga/effects';

import { Apis } from 'omnibazaarjs-ws';

export function* walletSubscriber() {
  yield all([
    takeEvery('GET_ACCOUNT_BALANCE', getAccountBalance)
  ]);
}

export function* getAccountBalance({ payload: { account } }) {
  try {
    const balanceId = account.get('balances').get('1.3.0');
    const result = yield Apis.instance().db_api().exec('get_objects', [[balanceId]]);
    yield put({ type: 'GET_ACCOUNT_BALANCE_SUCCEEDED', result: result[0] });
  } catch (e) {
    yield put({ type: 'GET_ACCOUNT_BALANCE_FAILED', error: e });
  }
}