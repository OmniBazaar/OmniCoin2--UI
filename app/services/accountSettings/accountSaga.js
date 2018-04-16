import {
  put,
  takeLatest,
  select,
  all,
  call
} from 'redux-saga/effects';
import { TransactionBuilder, ChainStore } from 'omnibazaarjs/es';
import { Apis } from 'omnibazaarjs-ws';

import { generateKeyFromPassword } from '../blockchain/utils/wallet';

export function* accountSubscriber() {
  yield all([
    takeLatest('UPDATE_PUBLIC_DATA', updatePublicData),
    takeLatest('GET_PUBLISHERS', getPublishers),
    takeLatest('GET_RECENT_TRANSACTIONS', getRecentTransactions)
  ]);
}

export function* updatePublicData() {
  const { account } = (yield select()).default;
  let payload = {
    is_a_publisher: account.publisher,
    is_an_escrow: account.escrow,
    referrer: account.referrer,
  };
  if (account.publisher) {
    payload = {
      ...payload,
      publisher_ip: account.ipAddress
    };
  }
  try {
    yield updateAccount(payload);
    yield put({ type: 'UPDATE_PUBLIC_DATA_SUCCEEDED' });
  } catch (e) {
    console.log('ERR', e);
    yield put({ type: 'UPDATE_PUBLIC_DATA_FAILED', error: e });
  }
}

export function* getPublishers() {
  try {
    const publishers = yield Apis.instance().db_api().exec('get_publisher_nodes_names', []);
    yield put({ type: 'GET_PUBLISHERS_SUCCEEDED', publishers });
  } catch (e) {
    console.log('ERR', e);
    yield put({ type: 'GET_PUBLISHERS_FAILED', error: e });
  }
}


export function* updateAccount(payload) {
  const { currentUser, account } = (yield select()).default.auth;
  const tr = new TransactionBuilder();
  tr.add_type_operation(
    'account_update',
    {
      account: account.get('id'),
      ...payload
    }
  );
  const activeKey = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
  tr.add_signer(activeKey.privKey, activeKey.pubKey);
  tr.set_required_fees();
  return yield tr.broadcast();
}

export function* getRecentTransactions() {
  const {account} = (yield select()).default.auth;
  try {
    const result  = yield call(ChainStore.fetchRecentHistory.bind(ChainStore), account);
    console.log('Result ', result);
    let history = [];
    let h = result.get("history");
    let seen_ops = new Set();
    history = history.concat(h.toJS().filter(op => !seen_ops.has(op.id) && seen_ops.add(op.id)));
    history = history.filter(el => !!el.op[1].amount);
    yield put({type: 'GET_RECENT_TRANSACTIONS_SUCCEEDED', transactions: history});
  } catch (e) {
    console.log('ERROR', e);
    yield put({type: 'GET_RECENT_TRANSACTIONS_FAILED', error: e})
  }

}
