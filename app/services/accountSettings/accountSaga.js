import {
  put,
  takeLatest,
  select,
  all,
  call
} from 'redux-saga/effects';
import { TransactionBuilder, FetchChain, ChainStore, ChainTypes } from 'omnibazaarjs/es';
import { ipcRenderer } from 'electron';
import {Apis} from "omnibazaarjs-ws";
import _ from 'lodash';

import { getAllPublishers } from './services';
import {
  generateKeyFromPassword,
} from '../blockchain/utils/wallet';
import HistoryStorage from './historyStorage';
import {getStoredCurrentUser} from "../blockchain/auth/services";
import {voteForProcessors} from "../processors/utils";


export function* accountSubscriber() {
  yield all([
    takeLatest('UPDATE_PUBLIC_DATA', updatePublicData),
    takeLatest('GET_PUBLISHERS', getPublishers),
    takeLatest('GET_RECENT_TRANSACTIONS', getRecentTransactions),
    takeLatest('CHANGE_SEARCH_PRIORITY_DATA', updatePublisherData),
    takeLatest('UPDATE_PUBLISHER_DATA', updatePublisherData),
  ]);
}

export function* updatePublicData() {
  const { account } = (yield select()).default;
  const { is_a_processor } = (yield select()).default.auth.account;
  try {
    yield updateAccount({
      transactionProcessor: is_a_processor ? false: account.transactionProcessor,
      wantsToVote: account.wantsToVote,
      is_a_publisher: account.publisher,
      is_an_escrow: account.escrow,
      publisher_ip: account.ipAddress,
    });
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
  let trObj = {...payload};
  if (!trObj.is_a_publisher) {
    delete trObj.publisher_ip;
  }
  if (trObj.transactionProcessor) {
    tr.add_type_operation('witness_create', {
      witness_account: account.id,
      url: '',
      block_signing_key:  key.privKey.toPublicKey()
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
      console.log("ERROR ", error);
    }
  });
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

export function* updatePublisherData() {
  yield put({ type: 'DHT_RECONNECT' });
}
