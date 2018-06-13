import { defineMessages } from 'react-intl';
import {
  put,
  takeEvery,
  call,
  all
} from 'redux-saga/effects';
import { FetchChain } from 'omnibazaarjs/es';

import { generateKeyFromPassword } from '../utils/wallet';
import { fetchAccount } from '../utils/miscellaneous';
import { faucetAddresses } from '../settings';
import { changeSearchPriorityData } from '../../accountSettings/accountActions';


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


export function* subscriber() {
  yield all([
    takeEvery('LOGIN', login),
    takeEvery('SIGNUP', signup),
    takeEvery('GET_ACCOUNT', getAccount)
  ]);
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
        if (auth.get(0) === key.pubKey) {
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
    referrer,
    searchPriorityData
  } = action.payload;
  const ownerKey = generateKeyFromPassword(username, 'owner', password);
  const activeKey = generateKeyFromPassword(username, 'active', password);
  try {
    const result = yield call(fetch, `${faucetAddresses[0]}/api/v1/accounts`, {
      method: 'post',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        account: {
          name: username,
          owner_key: ownerKey.pubKey,
          active_key: activeKey.pubKey,
          memo_key: activeKey.pubKey,
          referrer,
          harddrive_id: localStorage.getItem('hardDriveId'),
          mac_address: localStorage.getItem('macAddress')
        }
      })
    });
    const resJson = yield call([result, 'json']);
    if (result.status === 201) {
      yield put(changeSearchPriorityData(searchPriorityData));
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
      let e;
      if(error.base && error.base.length && error.base.length > 0) {
        e = error.base[0]
      } else if (error.remote_ip && error.remote_ip.length && error.remote_ip.length > 0) {
        e = error.remote_ip[0]
      } else {
        e = JSON.stringify(error)
      }
      
      yield put({ type: 'SIGNUP_FAILED', error: e });
    }
  } catch (e) {
    console.log('ERROR', e);
    yield put({ type: 'SIGNUP_FAILED', error: e });
  }
}


export function* getAccount({ payload: { username } }) {
  try {
    const account = yield call(fetchAccount, username);
    yield put({ type: 'GET_ACCOUNT_SUCCEEDED', account });
  } catch (e) {
    console.log('ERROR ', e);
    yield put({ type: 'GET_ACCOUNT_FAILED', error: messages.noAccount });
  }
}
