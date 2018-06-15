import {
  put,
  call,
  all,
  takeEvery,
  select
} from 'redux-saga/effects';

import * as BitcoinApi from './BitcoinApi';
import { persitBitcoinWalletData, getBitcoinWalletData } from './services';

export function* bitcoinSubscriber() {
  yield all([
    takeEvery('CREATE_WALLET', createWallet),
    takeEvery('GET_WALLETS', getWallets),
    takeEvery('MAKE_PAYMENT', makePayment),
    takeEvery('GET_BALANCE', getBalance),
    takeEvery('ADD_ADDRESS', addAddress)
  ]);
}

function* createWallet({ payload: { password, label, email } }) {
  try {
    const res = yield call(BitcoinApi.createWallet, password, label, email);
    const { currentUser } = (yield select()).default.auth;
    yield call(persitBitcoinWalletData, res.guid, password, currentUser);
    yield put({ type: 'CREATE_WALLET_SUCCEEDED', guid: res.guid });
  } catch (error) {
    console.log('ERROR ', error);
    yield put({ type: 'CREATE_WALLET_FAILED', error });
  }
}

function* getWallets() {
  try {
    const { currentUser } = (yield select()).default.auth;
    const walletData = yield call(getBitcoinWalletData, currentUser);
    if (walletData) {
      const { guid, password } = walletData;
      const res = yield call(BitcoinApi.getWallets, password, guid);
      yield put({ type: 'GET_WALLETS_SUCCEEDED', wallets: res, guid, password });
    } else {
      yield put({ type: 'GET_WALLETS_SUCCEEDED', wallets: [] });
    }
  } catch (error) {
    console.log('ERROR ', error);
    yield put({ type: 'GET_WALLETS_FAILED', error });
  }
}

function* makePayment({
  payload: {
    guid, password, to, amount, from, fee
  }
}) {
  try {
    const res = yield call(BitcoinApi.makePayment, guid, password, to, amount, from, fee);
    yield put({ type: 'MAKE_PAYMENT_SUCCEEDED', res });
  } catch (error) {
    yield put({ type: 'MAKE_PAYMENT_FAILED', error });
  }
}

function* getBalance({ payload: { guid, password, address } }) {
  try {
    const res = yield call(BitcoinApi.getBalance, guid, password, address);
    yield put({ type: 'GET_BALANCE_SUCCEEDED', balance: res.balance });
  } catch (error) {
    yield put({ type: 'GET_BALANCE_FAILED', error });
  }
}

function* addAddress({ payload: { guid, password, label } }) {
  console.log('ADDING ADDRESS', guid, password, label);
  try {
    const res = yield call(BitcoinApi.addAddress, password, guid, label);
    const address = yield call(BitcoinApi.getAddress, res.xpub, guid, password);
    yield put({ type: 'ADD_ADDRESS_SUCCEEDED', address });
  } catch (error) {
    yield put({ type: 'ADD_ADDRESS_FAILED', error });
  }
}
