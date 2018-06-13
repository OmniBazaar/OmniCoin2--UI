import {
  put,
  takeLatest,
  select,
  all,
  call
} from 'redux-saga/effects';
import { TransactionBuilder, FetchChain, ChainStore, ChainTypes } from 'omnibazaarjs/es';
import { getAllPublishers } from './services';

import {
  generateKeyFromPassword,
} from '../blockchain/utils/wallet';
import HistoryStorage from './historyStorage';


export function* accountSubscriber() {
  yield all([
    takeLatest('UPDATE_PUBLIC_DATA', updatePublicData),
    takeLatest('GET_PUBLISHERS', getPublishers),
    takeLatest('GET_RECENT_TRANSACTIONS', getRecentTransactions),
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
    const publishers = yield call(getAllPublishers);
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
      account: account.id,
      ...payload
    }
  );
  const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
  yield tr.set_required_fees();
  yield tr.add_signer(key.privKey, key.pubKey);
  yield tr.broadcast();
}


export function* getRecentTransactions() {
  const {  currentUser } = (yield select()).default.auth;
  try {
    const historyStorage = new HistoryStorage(currentUser.username);
    yield historyStorage.refresh(currentUser);
    yield put({ type: 'GET_RECENT_TRANSACTIONS_SUCCEEDED', transactions: historyStorage.getHistory() });
  } catch (e) {
    console.log('ERROR', e);
    yield put({ type: 'GET_RECENT_TRANSACTIONS_FAILED', error: e });
  }
}
