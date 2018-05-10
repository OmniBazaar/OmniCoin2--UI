import {
  put,
  takeLatest,
  select,
  all,
  call
} from 'redux-saga/effects';
import { TransactionBuilder, ChainStore, FetchChain } from 'omnibazaarjs/es';
import { Apis } from 'omnibazaarjs-ws';


import {
  generateKeyFromPassword,
  decodeMemo,
} from '../blockchain/utils/wallet';

import HistoryStorage from './historyStorage';

import {
  getGlobalObject,
  getDynGlobalObject,
  calcBlockTime
} from '../blockchain/utils/miscellaneous';

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
  const { account, currentUser } = (yield select()).default.auth;
  const activeKey = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
  const [globalObject, dynGlobalObject] = yield Promise.all([
    getGlobalObject(),
    getDynGlobalObject()
  ]);
  try {
    const result = yield call(ChainStore.fetchRecentHistory.bind(ChainStore), account.id);
    let history = [];
    const h = result.get('history');
    const seenOps = new Set();
    history = history.concat(h.toJS().filter(op => !seenOps.has(op.id) && seenOps.add(op.id)));
    history = history.filter(el => !!el.op[1].amount);
    const historyStorage = new HistoryStorage(currentUser.username);
    for (let i = 0; i < history.length; ++i) {
      const el = history[i];
      if (!historyStorage.exists(el.id)) {
        const [from, to] = yield Promise.all([
          FetchChain('getAccount', el.op[1].from),
          FetchChain('getAccount', el.op[1].to)
        ]);
        historyStorage.addOperation({
          id: el.id,
          blockNum: el.block_num,
          opInTrx: el.op_in_trx,
          trxInBlock: el.trx_in_block,
          date: calcBlockTime(el.block_num, globalObject, dynGlobalObject),
          fromTo: from.get('name') === currentUser.username ? to.get('name') : from.get('name'),
          from: from.get('name'),
          to: to.get('name'),
          memo: el.op[1].memo ? decodeMemo(el.op[1].memo, activeKey) : null,
          amount: el.op[1].amount.amount / 100000,
          fee: el.op[1].fee.amount / 100000,
          type: from.get('name') === currentUser.username ? HistoryStorage.OperationTypes.withdraw : HistoryStorage.OperationTypes.deposit
        });
      }
    }
    historyStorage.save();
    yield put({ type: 'GET_RECENT_TRANSACTIONS_SUCCEEDED', transactions: historyStorage.getHistory() });
  } catch (e) {
    console.log('ERROR', e);
    yield put({ type: 'GET_RECENT_TRANSACTIONS_FAILED', error: e });
  }
}
