import {
  put,
  takeLatest,
  select,
  all,
  call
} from 'redux-saga/effects';
import { TransactionBuilder, FetchChain, ChainStore, ChainTypes } from 'omnibazaarjs/es';
import { Apis } from 'omnibazaarjs-ws';
import { getAllPublishers } from './services';


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
import AccountSettingsStorage from './accountStorage';

export function* accountSubscriber() {
  yield all([
    takeLatest('UPDATE_PUBLIC_DATA', updatePublicData),
    takeLatest('GET_PUBLISHERS', getPublishers),
    takeLatest('GET_RECENT_TRANSACTIONS', getRecentTransactions),
    takeLatest('CHANGE_PRIORITY', changePriority),
    takeLatest('CHANGE_COUNTRY', changeCountry),
    takeLatest('CHANGE_CITY', changeCity),
    takeLatest('CHANGE_CATEGORY', changeCategory),
    takeLatest('CHANGE_PUBLISHER_NAME', changePublisherName),
    takeLatest('CHANGE_KEYWORDS', changeKeywords),
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

async function getParties(op) {
  switch (op[0]) {
    case ChainTypes.operations.transfer:
      return await Promise.all([
        FetchChain('getAccount', op[1].from),
        FetchChain('getAccount', op[1].to)
      ]);
    case ChainTypes.operations.escrow_create_operation:
      return await Promise.all([
        FetchChain('getAccount', op[1].buyer),
        FetchChain('getAccount', op[1].seller)
      ]);
    case ChainTypes.operations.escrow_release_operation:
      return await Promise.all([
        FetchChain('getAccount', op[1].buyer_account),
        FetchChain('getAccount', op[1].seller_account || op[1].fee_paying_account)
      ]);
    case ChainTypes.operations.escrow_return_operation:
      return await Promise.all([
        FetchChain('getAccount', op[1].buyer_account || op[1].fee_paying_account),
        FetchChain('getAccount', op[1].seller_account)
      ]);
  }
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
    history = history.filter(el => [
      ChainTypes.operations.transfer,
      ChainTypes.operations.escrow_create_operation,
      ChainTypes.operations.escrow_release_operation,
      ChainTypes.operations.escrow_return_operation
    ].includes(el.op[0]));
    const historyStorage = new HistoryStorage(currentUser.username);
    for (let i = 0; i < history.length; ++i) {
      const el = history[i];
      if (!historyStorage.exists(el.id)) {
        const [from, to] = yield getParties(el.op);
        historyStorage.addOperation({
          id: el.id,
          blockNum: el.block_num,
          opInTrx: el.op_in_trx,
          trxInBlock: el.trx_in_block,
          date: calcBlockTime(el.block_num, globalObject, dynGlobalObject).toString(),
          fromTo: from.get('name') === currentUser.username ? to.get('name') : from.get('name'),
          from: from.get('name'),
          to: to.get('name'),
          memo: el.op[1].memo ? decodeMemo(el.op[1].memo, activeKey) : null,
          amount: el.op[1].amount ? el.op[1].amount.amount / 100000 : 0,
          fee: el.op[1].fee.amount / 100000,
          type: from.get('name') === currentUser.username
            ? HistoryStorage.OperationTypes.withdraw
            : HistoryStorage.OperationTypes.deposit,
          operationType: el.op[0],
          // will be undefined if operation type is transfer
          escrow: el.op[0] === ChainTypes.operations.escrow_create_operation
            ? el.result[1]
            : el.op[1].escrow,
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

export function* changePriority({ payload: { priority } }) {
  yield AccountSettingsStorage.updatePublisherData({ priority });
}

export function* changeCountry({ payload: { country } }) {
  yield AccountSettingsStorage.updatePublisherData({ country });
}

export function* changeCity({ payload: { city } }) {
  yield AccountSettingsStorage.updatePublisherData({ city });
}

export function* changeCategory({ payload: { category } }) {
  yield AccountSettingsStorage.updatePublisherData({ category });
}

export function* changePublisherName({ payload: { publisher } }) {
  yield AccountSettingsStorage.updatePublisherData({ publisherName: publisher });
}

export function* changeKeywords({ payload: { keywords } }) {
  yield AccountSettingsStorage.updatePublisherData({ keywords: keywords || [] });
}
