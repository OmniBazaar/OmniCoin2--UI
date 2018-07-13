import {
  put,
  call,
  all,
  takeEvery,
  select
} from 'redux-saga/effects';

import * as EthereumApi from './EthereumApi';
import { persitEthereumWalletData, getEthereumWalletData } from './EthereumServices';
import { connectEthereumWalletFinish } from './EthereumActions';

export function* ethereumSubscriber() {
  yield all([
    takeEvery('CREATE_ETHEREUM_WALLET', createEthereumWallet),
    takeEvery('GET_ETHEREUM_WALLETS', getEthereumWallets),
    takeEvery('MAKE_ETHEREUM_PAYMENT', makeEthereumPayment),
    takeEvery('GET_ETHEREUM_BALANCE', getEthereumBalance),
    takeEvery('ADD_ETHEREUM_ADDRESS', addEthereumAddress),
    takeEvery('CONNECT_ETHEREUM_WALLET', connectEthereumWallet)
  ]);
}

function* createEthereumWallet({ payload: { password, label, email } }) {
  try {
    const res = yield call(EthereumApi.createEthereumWallet, password, label, email);
    const { currentUser } = (yield select()).default.auth;
    yield call(persitEthereumWalletData, res.guid, password, currentUser);
    yield put({ type: 'CREATE_ETHEREUM_WALLET_SUCCEEDED', guid: res.guid });
  } catch (error) {
    console.log('ERROR ', error);
    yield put({ type: 'CREATE_ETHEREUM_WALLET_FAILED', error });
  }
}

function* connectEthereumWallet({ payload: { guid, password } }) {
  try {
    const res = yield call(EthereumApi.getEthereumWallets, password, guid);
    const { currentUser } = (yield select()).default.auth;
    yield call(persitEthereumWalletData, guid, password, currentUser);
    yield put(connectWalletFinish());
    yield put({ type: 'GET_ETHEREUM_WALLETS_SUCCEEDED', wallets: res, guid, password });
  } catch (error) {
    console.log('Connect Ethereum wallet error', error);
    yield put(connectEthereumWalletFinish(error));
  }
}

function* getEthereumWallets({ payload: { guid, password }}) {
  try {
    const { currentUser } = (yield select()).default.auth;
    if (guid && password) {
      const res = yield call(EthereumApi.getEthereumWallets, password, guid);
      yield put({ type: 'GET_ETHEREUM_WALLETS_SUCCEEDED', wallets: res, guid, password });
    } else {
      const walletData = yield call(getEthereumWalletData, currentUser);
      if (walletData) {
        const {guid, password} = walletData;
        const res = yield call(EthereumApi.getEthereumWallets, password, guid);
        yield put({type: 'GET_ETHEREUM_WALLETS_SUCCEEDED', wallets: res, guid, password});
      } else {
        yield put({type: 'GET_ETHEREUM_WALLETS_SUCCEEDED', wallets: []});
      }
    }
  } catch (error) {
    console.log('ERROR ', error);
    yield put({ type: 'GET_ETHEREUM_WALLETS_FAILED', error });
  }
}

function* makeEthereumPayment({
  payload: {
    guid, password, to, amount, from, fee
  }
}) {
  try {
    const res = yield call(EthereumApi.makeEthereumPayment, guid, password, to, amount, from, fee);
    yield put({ type: 'MAKE_ETHEREUM_PAYMENT_SUCCEEDED', res });
  } catch (error) {
    yield put({ type: 'MAKE_ETHEREUM_PAYMENT_FAILED', error });
  }
}

function* getEthereumBalance({ payload: { guid, password, address } }) {
  try {
    const res = yield call(EthereumApi.getEthereumBalance, guid, password, address);
    yield put({ type: 'GET_ETHEREUM_BALANCE_SUCCEEDED', balance: res.balance });
  } catch (error) {
    yield put({ type: 'GET_ETHEREUM_BALANCE_FAILED', error });
  }
}

function* addEthereumAddress({ payload: { guid, password, label } }) {
  console.log('ADDING ETHEREUM ADDRESS', guid, password, label);
  try {
    const res = yield call(EthereumApi.addEthereumAddress, password, guid, label);
    const address = yield call(EthereumApi.getEthereumAddress, res.xpub, guid, password);
    yield put({ type: 'ADD_ETHEREUM_ADDRESS_SUCCEEDED', address });
  } catch (error) {
    yield put({ type: 'ADD_ETHEREUM_ADDRESS_FAILED', error });
  }
}
