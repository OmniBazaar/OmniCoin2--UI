import {
  put,
  call,
  all,
  takeEvery,
  select
} from 'redux-saga/effects';

import * as EthereumApi from './EthereumApi';
import { persitEthereumWalletData, getEthereumWalletData } from './EthereumServices';
import { connectWalletFinish } from './EthereumActions';

export function* EthereumSubscriber() {
  yield all([
    takeEvery('CREATE_WALLET', createWallet),
    takeEvery('GET_WALLETS', getWallets),
    takeEvery('MAKE_PAYMENT', makePayment),
    takeEvery('GET_BALANCE', getBalance),
    takeEvery('ADD_ADDRESS', addAddress),
    takeEvery('CONNECT_WALLET', connectWallet)
  ]);
}

function* createWallet({ payload: { password, label, email } }) {
  try {
    const res = yield call(EthereumApi.createWallet, password, label, email);
    const { currentUser } = (yield select()).default.auth;
    yield call(persitEthereumWalletData, res.guid, password, currentUser);
    yield put({ type: 'CREATE_WALLET_SUCCEEDED', guid: res.guid });
  } catch (error) {
    console.log('ERROR ', error);
    yield put({ type: 'CREATE_WALLET_FAILED', error });
  }
}

function* connectWallet({ payload: { guid, password } }) {
  try {
    const res = yield call(EthereumApi.getWallets, password, guid);
    const { currentUser } = (yield select()).default.auth;
    yield call(persitEthereumWalletData, guid, password, currentUser);
    yield put(connectWalletFinish());
    yield put({ type: 'GET_WALLETS_SUCCEEDED', wallets: res, guid, password });
  } catch (error) {
    console.log('Connect Ethereum wallet error', error);
    yield put(connectWalletFinish(error));
  }
}

function* getWallets({ payload: { guid, password }}) {
  try {
    const { currentUser } = (yield select()).default.auth;
    if (guid && password) {
      const res = yield call(EthereumApi.getWallets, password, guid);
      yield put({ type: 'GET_WALLETS_SUCCEEDED', wallets: res, guid, password });
    } else {
      const walletData = yield call(getEthereumWalletData, currentUser);
      if (walletData) {
        const {guid, password} = walletData;
        const res = yield call(EthereumApi.getWallets, password, guid);
        yield put({type: 'GET_WALLETS_SUCCEEDED', wallets: res, guid, password});
      } else {
        yield put({type: 'GET_WALLETS_SUCCEEDED', wallets: []});
      }
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
    const res = yield call(EthereumApi.makePayment, guid, password, to, amount, from, fee);
    yield put({ type: 'MAKE_PAYMENT_SUCCEEDED', res });
  } catch (error) {
    yield put({ type: 'MAKE_PAYMENT_FAILED', error });
  }
}

function* getBalance({ payload: { guid, password, address } }) {
  try {
    const res = yield call(EthereumApi.getBalance, guid, password, address);
    yield put({ type: 'GET_BALANCE_SUCCEEDED', balance: res.balance });
  } catch (error) {
    yield put({ type: 'GET_BALANCE_FAILED', error });
  }
}

function* addAddress({ payload: { guid, password, label } }) {
  console.log('ADDING ADDRESS', guid, password, label);
  try {
    const res = yield call(EthereumApi.addAddress, password, guid, label);
    const address = yield call(EthereumApi.getAddress, res.xpub, guid, password);
    yield put({ type: 'ADD_ADDRESS_SUCCEEDED', address });
  } catch (error) {
    yield put({ type: 'ADD_ADDRESS_FAILED', error });
  }
}
