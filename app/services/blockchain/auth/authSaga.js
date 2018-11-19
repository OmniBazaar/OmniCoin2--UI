import { defineMessages } from 'react-intl';
import {
  put,
  takeEvery,
  call,
  all,
  select,
} from 'redux-saga/effects';
import { FetchChain, TransactionBuilder } from 'omnibazaarjs/es';
import { Apis } from 'omnibazaarjs-ws';
import { ipcRenderer } from 'electron';

import { generateKeyFromPassword } from '../utils/wallet';
import { fetchAccount } from '../utils/miscellaneous';
import { changeSearchPriorityData } from '../../accountSettings/accountActions';
import {
  getAccount as getAccountAction,
  welcomeBonusSucceeded,
  welcomeBonusFailed,
  referralBonusSucceeded,
  referralBonusFailed,
  requestReferrerFinish,
  referralBonus as referralBonusAction,
} from './authActions';
import { getFirstReachable } from './services';
import * as AuthApi from './AuthApi';
import { SubmissionError } from 'redux-form';
import { getAuthHeaders } from '../../listing/apis';
import { setup } from "../../accountSettings/accountActions";
import isOnline from 'is-online';


const messages = defineMessages({
  invalidPassword: {
    id: 'AuthService.invalidPassword',
    defaultMessage: 'Invalid password'
  },
  noAccount: {
    id: 'AuthService.noAccount',
    defaultMessage: 'Account doesn\'t exist'
  },
  accountExists: {
    id: 'AuthService.accountExist',
    defaultMessage: 'This account name is already taken. Please choose another one'
  },
  invalidUsername: {
    id: 'AuthService.invalidUsername',
    defaultMessage: 'Use only lowercase alphanumeric characters, dashes and periods. Usernames must start with a letter and cannot end with a dash.'
  },
  invalidTelegramPhoneNumber: {
    id: 'AuthService.invalidTelegramPhoneNumber',
    defaultMessage: 'Not joined to channel or not started the bot'
  },
  invalidTwitterUsername: {
    id: 'AuthService.invalidTwitterUsername',
    defaultMessage: 'Not following'
  },
  invalidMailChimpEmail: {
    id: 'AuthService.invalidMailChimpEmail',
    defaultMessage: 'Not subscribed'
  }
});


export function* subscriber() {
  yield all([
    takeEvery('LOGIN', login),
    takeEvery('SIGNUP', signup),
    takeEvery('GET_ACCOUNT', getAccount),
    takeEvery('GET_WELCOME_BONUS_AMOUNT', getWelcomeBonusAmount),
    takeEvery('IS_WELCOME_BONUS_RECEIVED', isWelcomeBonusReceived),
    takeEvery('RECEIVE_WELCOME_BONUS', receiveWelcomeBonus),
    takeEvery('GET_IDENTITY_VERIFICATION_TOKEN', getIdentityVerificationToken),
    takeEvery('GET_IDENTITY_VERIFICATION_STATUS', getIdentityVerificationStatus),
    takeEvery('REQUEST_REFERRER', requestReferrer),
    takeEvery('REFERRAL_BONUS', referralBonus),
    takeEvery('LOGOUT', logout)
  ]);
}

function* login(action) {
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

      //call this to cache listing request auth header, because it's a heavy operation
      yield call(getAuthHeaders, { username, password });

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

function* signup(action) {
  const {
    username,
    password,
    referrer,
    searchPriorityData
  } = action.payload;
  const { faucets } = (yield select()).default.config;
  const faucet = yield call(getFirstReachable, faucets);
  const ownerKey = generateKeyFromPassword(username, 'owner', password);
  const activeKey = generateKeyFromPassword(username, 'active', password);
  const macAddress = localStorage.getItem('macAddress');
  const harddriveId = localStorage.getItem('hardDriveId');
  try {
    let online = yield isOnline();
    if (!online) {
      throw new Error("There is not internet connection. Please try again.")
    }
    const referrerAccount = yield Apis.instance().db_api().exec('get_account_by_name', [referrer]);

    if (referrer) {
      if (referrerAccount == null || !referrerAccount.is_referrer) {
        throw new Error('Referrer account not found');
      }
    }

    const result = yield call(fetch, `${faucet}/api/v1/accounts`, {
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
      
      const { isWelcomeBonusAvailable } = yield call(AuthApi.isWelcomeBonusAvailable, { harddriveId, macAddress });
      yield put({
        type: 'SIGNUP_SUCCEEDED',
        user: {
          username,
          password
        },
        isWelcomeBonusAvailable
      });
      yield put(changeSearchPriorityData(searchPriorityData));
    } else {
      const { error } = resJson;
      let e;
      if (error.base && error.base.length && error.base.length > 0) {
        e = error.base[0] === 'Account exists' ? messages.accountExists : messages.invalidUsername;
      } else if (error.remote_ip && error.remote_ip.length && error.remote_ip.length > 0) {
        e = error.remote_ip[0];
      } else if (error.name && error.name.length && error.name.length > 0) {
        e = error.name[0];
      } else {
        e = JSON.stringify(error);
      }
      yield put({ type: 'SIGNUP_FAILED', error: e });
    }
  } catch (e) {
    console.log('ERROR', e);
    let error;
    if (e.name === 'TypeError') {
      error = 'Please try again in a few minutes.';
    } else {
      error = (typeof e === 'object') ? e.message : e;
    }
    yield put({ type: 'SIGNUP_FAILED', error });
  }
}


function* getAccount({ payload: { username } }) {
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

function* getWelcomeBonusAmount() {
  try {
    const amount = yield Apis.instance().db_api().exec('get_welcome_bonus_amount', []);
    yield put({ type: 'GET_WELCOME_BONUS_AMOUNT_SUCCEEDED', amount });
  } catch (error) {
    yield put({ type: 'GET_WELCOME_BONUS_AMOUNT_FAILED', error });
  }
}

function* getIdentityVerificationToken({ payload: { username } }) {
  try {
    const resp = yield call(AuthApi.getIdentityVerificationToken, username);
    yield put({ type: 'GET_IDENTITY_VERIFICATION_TOKEN_SUCCEEDED', token: resp.token });
  } catch (error) {
    console.log(error);
  }
}

function* isWelcomeBonusReceived({ payload: { username } }) {
  try {
    const macAddress = localStorage.getItem("macAddress");
    const harddriveId = localStorage.getItem("hardDriveId");
    const data = {
      harddriveId,
      macAddress
    };
    const response = yield call(AuthApi.isWelcomeBonusAvailable, data);
    const resp = yield call(AuthApi.isWelcomeBonusReceived, username);
    yield put({
      type: "IS_WELCOME_BONUS_RECEIVED_SUCCEEDED",
      payload: {
        isWelcomeBonusReceived: resp.isWelcomeBonusReceived,
        isWelcomeBonusAvailable: response.isWelcomeBonusAvailable
      }
    });
  } catch (error) {
    console.log(error);
  }
}


function* getIdentityVerificationStatus({ payload: { data: username } }) {
  try {
    const response = yield call(AuthApi.getIdentityVerificationStatus, username);
    yield put({ type: 'GET_IDENTITY_VERIFICATION_STATUS_SUCCEEDED', response });
  } catch (error) {
    console.log(error);
  }
}

function* receiveWelcomeBonus({ payload: { data: { values, reject } } }) {
  try {
    // Check if the user is connected to all 3 OmnibaZaar social media channels
    yield call(AuthApi.checkBonus, values);
    const macAddress = localStorage.getItem('macAddress');
    const harddriveId = localStorage.getItem('hardDriveId');
    const { currentUser } = (yield select()).default.auth;
    const { telegramPhoneNumber, email, twitterUsername } = values;
    const data = {
      harddriveId,
      macAddress,
      email,
      telegramPhoneNumber,
      twitterUsername,
      userName: currentUser.username
    };
    yield call(AuthApi.receiveWelcomeBonus, data);
    yield put(welcomeBonusSucceeded());
    yield put(referralBonusAction());
  } catch (error) {
    yield call(reject, new SubmissionError(error.messages));
    yield put(welcomeBonusFailed(error.message));
  }
}

function* referralBonus() {
  try {
    const { currentUser } = (yield select()).default.auth;
    const account = yield FetchChain('getAccount', currentUser.username);
    const isBonusAvailable = yield Apis.instance().db_api().exec('is_referral_bonus_available', []);
    if (isBonusAvailable
        && account.get('received_welcome_bonus')
        && !account.get('sent_referral_bonus')) {
      const tr = new TransactionBuilder();
      tr.add_type_operation('referral_bonus_operation', {
        referred_account: account.get('id'),
        referrer_account: account.get('referrer')
      });
      const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
      yield tr.set_required_fees();
      yield tr.add_signer(key.privKey, key.pubKey);
      yield tr.broadcast();
    }
    yield put(referralBonusSucceeded());
  } catch (error) {
    console.log('ERROR ', error);
    yield put(referralBonusFailed(error));
  }
}

function* requestReferrer() {
  const referrer = yield call(getDefaultReferrer);
  yield put(requestReferrerFinish(referrer));
}

function* logout() {
  // reseting redux store
  yield put({ type: 'RESET' });
  // ChainStore.resetCache();
  yield put(setup());
}

const getDefaultReferrer = () => new Promise((resolve, reject) => {
  ipcRenderer.once('receive-referrer', (event, arg) => {
    const referrer = arg.referrer;
    localStorage.setItem('referrer', referrer);
    resolve(referrer);
  });
  ipcRenderer.send('get-referrer', null);
});
