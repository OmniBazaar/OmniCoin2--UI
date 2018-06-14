import {
  takeEvery,
  put,
  all,
  call
} from 'redux-saga/effects';

import { FetchChain } from 'omnibazaarjs/es';
import { Apis } from 'omnibazaarjs-ws';

export function* walletSubscriber() {
  yield all([
    takeEvery('GET_ACCOUNT_BALANCE', getAccountBalance)
  ]);
}

const getBalance = async (account) => {
  return await Apis.instance().db_api().exec('get_account_balances', [account.id, ['1.3.0']]);
}

export function* getAccountBalance({ payload: { account } }) {
  try {
    // const balanceId = (yield call(FetchChain, 'getAccount', account.name)).get('balances').get('1.3.0');
    // const result = yield Apis.instance().db_api().exec('get_objects', [[balanceId]]);
    // yield put({ type: 'GET_ACCOUNT_BALANCE_SUCCEEDED', result: result[0] });
    const balances = yield call(getBalance, account);
    const result = balances && balances.length ? { balance: balances[0].amount } : null;
    yield put({ type: 'GET_ACCOUNT_BALANCE_SUCCEEDED', result: result });
  } catch (e) {
    yield put({ type: 'GET_ACCOUNT_BALANCE_FAILED', error: e });
  }
}
