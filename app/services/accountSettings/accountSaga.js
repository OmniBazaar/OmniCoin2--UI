import {
  put,
  takeLatest,
  select,
  all
} from 'redux-saga/effects';
import { TransactionBuilder } from 'omnibazaarjs/es';
import { Apis } from 'omnibazaarjs-ws';

import { generateKeyFromPassword } from '../blockchain/utils/wallet';

export function* accountSubscriber() {
  yield all([
    takeLatest('UPDATE_PUBLIC_DATA', updatePublicData),
    takeLatest('GET_PUBLISHERS', getPublishers),
  ]);
}

export function* updatePublicData() {
  const { account } = (yield select()).default;
  console.log('IP ADDRESS ', account.ipAddress);
  try {
    yield updateAccount({
      is_a_publisher: account.publisher,
      is_an_escrow: account.escrow,
      referrer: account.referrer,
      publisher_ip: account.ipAddress
    });
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
  tr.add_signer(activeKey.privKey, activeKey.privKey.toPublicKey().toPublicKeyString('BTS'));
  tr.set_required_fees();
  return yield tr.broadcast();
}

