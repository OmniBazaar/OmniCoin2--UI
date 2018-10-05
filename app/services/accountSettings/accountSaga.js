import {
  put,
  takeLatest,
  select,
  all,
  call
} from 'redux-saga/effects';
import { TransactionBuilder, FetchChain } from 'omnibazaarjs/es';
import { ipcRenderer } from 'electron';
import { Apis } from 'omnibazaarjs-ws';
import _ from 'lodash';

import { CoinTypes } from '../../scenes/Home/scenes/Wallet/constants';
import {getAllPublishers, getPublisherByIp} from './services';
import { generateKeyFromPassword } from '../blockchain/utils/wallet';
import OmnicoinHistory from './omnicoinHistory';
import { getStoredCurrentUser } from '../blockchain/auth/services';
import { voteForProcessors } from '../processors/utils';
import EthereumHistory from './ethereumHistory';
import * as BitcoinApi from '../blockchain/bitcoin/BitcoinApi';
import { SATOSHI_IN_BTC } from "../../utils/constants";
import BitcoinObFeesHistory from "./bitcoinHistory";
import {
  setupFailed,
  setupSucceeded
} from "./accountActions";
import { getConfig } from "../config/configActions";
import {
  requestPcIds,
  requestReferrer,
  getLastLoginUserName
} from "../blockchain/auth/authActions";
import { loadListingDefault } from "../listing/listingDefaultsActions";
import { loadLocalPreferences } from "../preferences/preferencesActions";
import { checkUpdate } from "../updateNotification/updateNotificationActions";
import { publisherCheckUpdate } from '../publisherUpdateNotification/publisherUpdateNotificationActions';

const processBitcoinTransactions = (txs) => {
  const currentUser = getStoredCurrentUser();
  const obHistory = new BitcoinObFeesHistory(currentUser.username);
  return txs.map(tx => {
      const info = obHistory.getTxInfo(tx.hash);
      if (info && info.obFee) {
        Object.keys(info.obFee).forEach(key => {
          info.obFee[key] /=  SATOSHI_IN_BTC;
        });
      }
      return {
        id: tx.tx_index,
        isBtc: true,
        hash: tx.hash,
        date: tx.time * 1000,
        vin_sz: tx.vin_sz,
        vout_sz: tx.vout_sz,
        fromTo: tx.out[0].addr,
        amount: tx.out[0].value / SATOSHI_IN_BTC,
        fee: tx.result > 0 ? 0 : tx.fee / SATOSHI_IN_BTC,
        isIncoming: tx.result > 0,
        obFee: info ? info.obFee : {}
      }
    }
  );
};

export function* accountSubscriber() {
  yield all([
    takeLatest('UPDATE_PUBLIC_DATA', updatePublicData),
    takeLatest('GET_PUBLISHERS', getPublishers),
    takeLatest('GET_RECENT_TRANSACTIONS', getRecentTransactions),
    takeLatest('CHANGE_SEARCH_PRIORITY_DATA', updatePublisherData),
    takeLatest('UPDATE_PUBLISHER_DATA', updatePublisherData),
    takeLatest('SETUP', setup)
  ]);
}

export function* updatePublicData() {
  const { account } = (yield select()).default;
  const { currentUser } = (yield select()).default.auth;
  const { is_a_processor } = (yield select()).default.auth.account;

  const dbAccount = yield (Apis.instance().db_api().exec('get_account_by_name', [currentUser.username]));
  
  const data = {
    transactionProcessor: is_a_processor ? false : account.transactionProcessor,
    wantsToVote: account.wantsToVote,
    is_referrer: account.referrer,
    is_an_escrow: account.escrow,
    btc_address: account.btcAddress,
    eth_address: account.ethAddress,
  };

  if (dbAccount.is_a_publisher !== account.publisher || dbAccount.publisher_ip !== account.ipAddress) {
    data['is_a_publisher'] = account.publisher;
    data['publisher_ip'] = account.publisher ? account.ipAddress : '';
  }

  try {
    yield updateAccount(data);
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
  const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
  const tr = new TransactionBuilder();
  const trObj = { ...payload };

  if (!trObj.is_a_publisher) {
    delete trObj.publisher_ip;
  } else {
    const publisherAcc = yield call(getPublisherByIp, trObj.publisher_ip);
    if (!!publisherAcc && publisherAcc['name'] !== currentUser.username) {
      throw {message: "is already registered"};
    }
  }

  if (trObj.transactionProcessor) {
    tr.add_type_operation('witness_create', {
      witness_account: account.id,
      url: '',
      block_signing_key: key.privKey.toPublicKey(),
    });
  }

  const { wantsToVote } = trObj;

  delete trObj.wantsToVote;
  delete trObj.transactionProcessor;

  tr.add_type_operation(
    'account_update',
    {
      account: account.id,
      ...trObj
    }
  );
  yield tr.set_required_fees();
  yield tr.add_signer(key.privKey, key.pubKey);
  yield tr.broadcast(async () => {
    const currentUser = getStoredCurrentUser();
    const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
    const account = (await FetchChain('getAccount', currentUser.username)).toJS();
    const witness = await Apis.instance().db_api().exec('get_witness_by_account', [account.id]);
    if (witness) {
      ipcRenderer.send('restart-node', witness.id, key.pubKey, key.privKey.toWif());
    }
    try {
      if (wantsToVote) {
        await voteForProcessors(
          _.union(account.options.votes, [witness.vote_id]),
          account,
          currentUser.password
        );
      }
    } catch (error) {
      console.log('ERROR ', error);
    }
  });
}


export function* getRecentTransactions({ payload: { coinType } }) {
  const { auth: { currentUser }, ethereum } = (yield select()).default;
  try {
    if (coinType === CoinTypes.OMNI_COIN) {
      const historyStorage = new OmnicoinHistory(currentUser);
      yield historyStorage.refresh();
      yield put({ type: 'GET_RECENT_TRANSACTIONS_SUCCEEDED', transactions: historyStorage.getHistory() });
    } else if (coinType === CoinTypes.ETHEREUM) {
      const historyStorage = new EthereumHistory(ethereum.address);
      yield historyStorage.loadTransactions();
      yield put({ type: 'GET_RECENT_TRANSACTIONS_SUCCEEDED', transactions: historyStorage.getHistory() });
    } else if (coinType === CoinTypes.BIT_COIN) {
      const { wallets } = (yield select()).default.bitcoin;
      const res = yield call(BitcoinApi.getHistory, wallets, 10000, 0);
      yield put({ type: 'GET_RECENT_TRANSACTIONS_SUCCEEDED', transactions: processBitcoinTransactions(res.txs) });
    }

  } catch (e) {
    console.log('ERROR', e);
    yield put({ type: 'GET_RECENT_TRANSACTIONS_FAILED', error: e });
  }
}

export function* updatePublisherData() {
  yield put({ type: 'DHT_RECONNECT' });
}

export function* setup() {
  try {
    yield put(getConfig());
    yield put(requestPcIds());
    yield put(requestReferrer());
    yield put(getLastLoginUserName());
    yield put(loadListingDefault());
    yield put(loadLocalPreferences());
    yield put(checkUpdate());
    yield put(publisherCheckUpdate());
    yield put(setupSucceeded());
  } catch (error) {
    yield put(setupFailed(error));
    console.log('ERROR ', error);
  }
}
