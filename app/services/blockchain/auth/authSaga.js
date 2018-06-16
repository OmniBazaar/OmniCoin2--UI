import { defineMessages } from 'react-intl';
import {
  put,
  takeEvery,
  call,
  all,
  select,
  fork
} from 'redux-saga/effects';
import { FetchChain, TransactionBuilder } from 'omnibazaarjs/es';
import { Apis } from 'omnibazaarjs-ws';

import { generateKeyFromPassword } from '../utils/wallet';
import { fetchAccount } from '../utils/miscellaneous';
import { faucetAddresses } from '../settings';
import { changeSearchPriorityData } from '../../accountSettings/accountActions';
import {
  getAccount as getAccountAction,
  welcomeBonus as welcomeBonusAction,
  welcomeBonusSucceeded,
  welcomeBonusFailed
} from './authActions';


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
    takeEvery('GET_ACCOUNT', getAccount),
    takeEvery('WELCOME_BONUS', welcomeBonus),
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
      yield put(getAccountAction(username));
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
  const macAddress = localStorage.getItem('macAddress');
  const harddriveId = localStorage.getItem('hardDriveId');
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
          harddrive_id: harddriveId,
          mac_address: macAddress
        }
      })
    });
    const resJson = yield call([result, 'json']);
    if (result.status === 201) {
      yield put(getAccountAction(username));
      yield put({
        type: 'SIGNUP_SUCCEEDED',
        user: {
          username,
          password
        }
      });
      yield put(changeSearchPriorityData(searchPriorityData));
      yield put(welcomeBonusAction(username, referrer, macAddress, harddriveId))
    } else {
      const { error } = resJson;
      console.log('ERROR', error);
      let e;
      if(error.base && error.base.length && error.base.length > 0) {
        e = "Only lowercase alphanumeric characters, dashes and periods. Must start with a letter and cannot end with a dash."
      } else if (error.remote_ip && error.remote_ip.length && error.remote_ip.length > 0) {
        e = error.remote_ip[0]
      } else if (error.name && error.name.length && error.name.length > 0) {
        e = error.name[0]
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
    const isProcessor = yield Apis.instance().db_api().exec('lookup_witness_accounts', [username, 1]);
    account.is_a_processor = isProcessor[0] && isProcessor[0][0] === username;
    yield put({ type: 'GET_ACCOUNT_SUCCEEDED', account });
  } catch (e) {
    console.log('ERROR ', e);
    yield put({ type: 'GET_ACCOUNT_FAILED', error: messages.noAccount });
  }
}

function* welcomeBonus({ payload: { username, referrer, macAddress, harddriveId }}) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const isAvailable = yield Apis.instance().db_api().exec('is_welcome_bonus_available', [harddriveId, macAddress]);
    const acc = yield FetchChain('getAccount', username);
    if (isAvailable) {
      const tr = new TransactionBuilder();
      tr.add_type_operation('welcome_bonus_operation', {
        receiver: acc.get('id'),
        drive_id: harddriveId,
        mac_address: macAddress
      });
      const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
      yield tr.set_required_fees();
      yield tr.add_signer(key.privKey, key.pubKey);
      yield tr.broadcast(async () =>  {
        try {
          const referrerAcc = await FetchChain('getAccount', referrer);
          const tr = new TransactionBuilder();
          tr.add_type_operation('referral_bonus_operation', {
            referred_account: acc.get('id'),
            referrer_account: referrerAcc.get('id')
          });
          await tr.set_required_fees();
          await tr.add_signer(key.privKey, key.pubKey);
          await tr.broadcast();
        } catch (error) {
          console.log('ERROR', error);
        }
      });
      yield put(welcomeBonusSucceeded());
    }
  } catch (error) {
    console.log('ERROR ', error);
    yield put(welcomeBonusFailed(error));
  }
}
