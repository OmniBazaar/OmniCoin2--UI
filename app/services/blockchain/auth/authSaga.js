import { defineMessages } from 'react-intl';
import {
  put,
  takeEvery,
  takeLatest,
  call
} from 'redux-saga/effects';
import {
  PrivateKey,
  FetchChain,
} from 'omnibazaarjs/es';

const faucetAddress = 'http://35.171.116.3:80';

const messages = defineMessages({
  invalidPassword: {
    id: 'AuthService.invalidPassword',
    defaultMessage: 'Invalid password',
  },
  noAccount: {
    id: 'AuthService.noAccount',
    defaultMessage: 'Account doesn\'t exist'
  }
});


function generateKeyFromPassword(accountName, role, password) {
  const seed = accountName + role + password;
  const privKey = PrivateKey.fromSeed(seed);
  const pubKey = privKey.toPublicKey().toString();
  return { privKey, pubKey };
}

export function* subscriber() {
  yield takeEvery(
    'LOGIN',
    login
  );
  yield takeEvery(
    'SIGNUP',
    signup
  );
  yield takeLatest(
    'ACCOUNT_LOOKUP',
    accountLookup
  );
}

export function* login(action) {
  const {
    username,
    password
  } = action.payload;
  const roles = ['active', 'owner'];
  let isAuthorized = false;
  try {
    const account = yield call(FetchChain, 'getAccount', username);
    const key = generateKeyFromPassword(username, roles[0], password);
    roles.forEach(role => {
      account.getIn([role, 'key_auths']).forEach(auth => {
        if (auth.get(0) === key.privKey.toPublicKey().toPublicKeyString('BTS')) {
          isAuthorized = true;
        }
      });
    });
    if (isAuthorized) {
      yield put({
        type: 'LOGIN_SUCCEEDED',
        user: {
          username,
          password
        }
      });
    } else {
      yield put({ type: 'LOGIN_FAILED', error: messages.invalidPassword });
    }
  } catch (e) {
    console.log('ERROR ', e);
    yield put({ type: 'LOGIN_FAILED', error: messages.noAccount });
  }
}

export function* signup(action) {
  const {
    username,
    password,
    referrer
  } = action.payload;
  const ownerKey = generateKeyFromPassword(username, 'owner', password);
  const activeKey = generateKeyFromPassword(username, 'active', password);
  try {
    const result = yield call(fetch, `${faucetAddress}/api/v1/accounts`, {
      method: 'post',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        account: {
          name: username,
          owner_key: ownerKey.privKey.toPublicKey().toPublicKeyString('BTS'),
          active_key: activeKey.privKey.toPublicKey().toPublicKeyString('BTS'),
          memo_key: activeKey.privKey.toPublicKey().toPublicKeyString('BTS'),
          referrer,
          harddrive_id: localStorage.getItem('hardDriveId'),
          mac_address: localStorage.getItem('macAddress')
        }
      })
    });
    const resJson = yield call([result, 'json']);
    if (result.status === 201) {
      yield put({
        type: 'SIGNUP_SUCCEEDED',
        user: {
          username,
          password
        }
      });
    } else {
      const { error } = resJson;
      console.log('ERROR', error);
      const e = error.base && error.base.length && error.base.length > 0 ? error.base[0] : JSON.stringify(error);
      yield put({ type: 'SIGNUP_FAILED', error: e });
    }
  } catch (e) {
    console.log('ERROR', e);
    yield put({ type: 'SIGNUP_FAILED', error: e });
  }
}


export function* accountLookup(action) {
  const { username } = action.payload;
  try {
    const account = yield FetchChain('getAccount', username);
    yield put({ type: 'ACCOUNT_LOOKUP_SUCCEEDED', result: true });
  } catch (e) {
    yield put({ type: 'ACCOUNT_LOOKUP_SUCCEEDED', result: false });
  }
}
