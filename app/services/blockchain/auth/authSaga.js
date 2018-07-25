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
  welcomeBonus as welcomeBonusAction,
  welcomeBonusSucceeded,
  welcomeBonusFailed,
  requestReferrerFinish
} from './authActions';
import { getFirstReachable } from './services';
import * as AuthApi from './AuthApi';
import { email } from 'redux-form-validators';
import { SubmissionError } from 'redux-form';


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
    takeEvery('WELCOME_BONUS', welcomeBonus),
    takeEvery('GET_WELCOME_BONUS_AMOUNT', getWelcomeBonusAmount),
    takeEvery('RECEIVE_WELCOME_BONUS', receiveWelcomeBonus),
    takeEvery('GET_IDENTITY_VERIFICATION_TOKEN', getIdentityVerificationToken),
    takeEvery('REQUEST_REFERRER', requestReferrer)
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
      yield put({ type: 'DHT_CONNECT' });
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
  const { faucets } = (yield select()).default.config;
  const faucet = yield call(getFirstReachable, faucets);
  const ownerKey = generateKeyFromPassword(username, 'owner', password);
  const activeKey = generateKeyFromPassword(username, 'active', password);
  const macAddress = localStorage.getItem('macAddress');
  const harddriveId = localStorage.getItem('hardDriveId');
  try {
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
      const isAvailable = yield Apis.instance().db_api().exec('is_welcome_bonus_available', [harddriveId, macAddress]);
      yield put({
        type: 'SIGNUP_SUCCEEDED',
        user: {
          username,
          password
        },
        isWelcomeBonusAvailable: isAvailable
      });
      yield put({ type: 'DHT_CONNECT' });
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
    const error = (typeof e === 'object') ? e.message : e;
    yield put({ type: 'SIGNUP_FAILED', error });
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

function* welcomeBonus({
  payload: {
    username, referrer, macAddress, harddriveId
  }
}) {
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
      yield tr.broadcast(async () => {
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

export function* getWelcomeBonusAmount() {
  try {
    const amount = yield Apis.instance().db_api().exec('get_welcome_bonus_amount', []);
    yield put({ type: 'GET_WELCOME_BONUS_AMOUNT_SUCCEEDED', amount });
  } catch (error) {
    yield put({ type: 'GET_WELCOME_BONUS_AMOUNT_FAILED', error });
  }
}

export function* getIdentityVerificationToken({ payload: { username } }) {
  try {
    const resp = yield call(AuthApi.getIdentityVerificationToken, username);
    yield put({ type: 'GET_IDENTITY_VERIFICATION_TOKEN_SUCCEEDED', token: resp.token });
  } catch (error) {
    console.log(error);
  }
}

// Check if the user is connected to all 3 OmnibaZaar social media channels

export function* receiveWelcomeBonus({ payload: { data: { values, reject, formatMessage } } }) {
  const errors = {};
  // Check if the user's telephone number is connected to the OmniBazaar's Telegram channel and Bot
  try {
    const telegramUserIdRes = yield call(AuthApi.getTelegramUserId, values.telegramPhoneNumber);
    if (telegramUserIdRes && telegramUserIdRes.result.contact.user_id) {
      yield call(AuthApi.getTelegramChatMember, telegramUserIdRes.result.contact.user_id);
    } else {
      errors.telegramPhoneNumber = formatMessage(messages.invalidTelegramPhoneNumber);
    }
  } catch (error) {
    if (!error.ok) {
      errors.telegramPhoneNumber = formatMessage(messages.invalidTelegramPhoneNumber);
    }
  }
  // Check if the user's twitter name is following the OmniBazaar's Twitter account
  try {
    const twitterTokenRes = yield call(AuthApi.getTwitterBearerToken);
    const twitterRes = yield call(AuthApi.checkTwitterFollowing, { token: twitterTokenRes.access_token, username: values.twitterUsername });
    if (!twitterRes.relationship.source.following) {
      errors.twitterUsername = formatMessage(messages.invalidTwitterUsername);
    }
    // Check if the user's email is in the OmniBazaar's MailChimp list
    yield call(AuthApi.checkMailChimpSubscribed, { email: values.email });
  } catch (error) {
    if (error.status === 404) {
      errors.email = formatMessage(messages.invalidMailChimpEmail);
    }
  }
  // in case user doesn't follow OmniBazaar's one of the 3 social channels throw error
  if (Object.keys(errors).length > 0) {
    yield call(reject, new SubmissionError(errors));
    yield put(welcomeBonusFailed());
  } else {
    const macAddress = localStorage.getItem('macAddress');
    const harddriveId = localStorage.getItem('hardDriveId');
    const referrer = localStorage.getItem('referrer');
    const { currentUser } = (yield select()).default.auth;
    yield put(welcomeBonusAction(currentUser.username, referrer, macAddress, harddriveId));
  }
}
  const getDefaultReferrer = () => new Promise((resolve, reject) => {
    ipcRenderer.once('receive-referrer', (event, arg) => {
      const referrer = arg.referrer;
      localStorage.setItem('referrer', referrer);
      resolve(referrer);
    });
    ipcRenderer.send('get-referrer', null);
  });


function* requestReferrer() {
  const referrer = yield call(getDefaultReferrer);
  yield put(requestReferrerFinish(referrer));
}
