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
    takeEvery('CONNECT_ETHEREUM_WALLET', connectEthereumWallet),
    takeEvery('GET_ETHEREUM_TRANSACTIONS', getEthereumTransactions)
  ]);
}

function* createEthereumWallet() {
  try {
    const res = EthereumApi.createEthereumWallet();

    const { currentUser } = (yield select()).default.auth;
    yield call(persitEthereumWalletData, res.address, res.privateKey, currentUser);
    yield put({ type: 'CREATE_ETHEREUM_WALLET_SUCCEEDED', address: res.address, brainKey: res.mnemonic });
  } catch (error) {
    console.log('ERROR ', error);
    yield put({ type: 'CREATE_ETHEREUM_WALLET_FAILED', error });
  }
}

function* connectEthereumWallet({ payload: { privateKey } }) {
  try {
    const res = yield call(EthereumApi.getEthereumWallets, privateKey, null);
    const { currentUser } = (yield select()).default.auth;
    yield call(persitEthereumWalletData, address, privateKey, currentUser);
    yield put(connectWalletFinish());
    yield put({ type: 'GET_ETHEREUM_WALLETS_SUCCEEDED', wallets: res, address, privateKey });
  } catch (error) {
    console.log('Connect Ethereum wallet error', error);
    yield put(connectEthereumWalletFinish(error));
  }
}

function* getEthereumWallets({ payload: { privateKey, brainKey } }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    if (privateKey || brainKey) {
      const res = yield call(EthereumApi.getEthereumWallets, privateKey, brainKey);
      yield put({ type: 'GET_ETHEREUM_WALLETS_SUCCEEDED', wallets: res, privateKey });
    } else {
      const walletData = yield call(getEthereumWalletData, currentUser);
      if (walletData) {
        const { address, privateKey } = walletData;
        const res = yield call(EthereumApi.getEthereumWallets, privateKey, null);
        yield put({ type: 'GET_ETHEREUM_BALANCE', payload: { address, privateKey }});
        yield put({ type: 'GET_ETHEREUM_WALLETS_SUCCEEDED', wallets: res, address, privateKey });
      } else {
        yield put({ type: 'GET_ETHEREUM_WALLETS_SUCCEEDED', wallets: [] });
      }
    }
  } catch (error) {
    console.log('ERROR ', error);
    yield put({ type: 'GET_ETHEREUM_WALLETS_FAILED', error });
  }
}

function* makeEthereumPayment({
  payload: {
    privateKey, to, amount
  }
}) {
  try {
    const res = yield call(EthereumApi.makeEthereumPayment, privateKey, to, amount);
    yield put({ type: 'MAKE_ETHEREUM_PAYMENT_SUCCEEDED', res });
  } catch (error) {
    yield put({ type: 'MAKE_ETHEREUM_PAYMENT_FAILED', error });
  }
}

function* getEthereumBalance({ payload: { privateKey } }) {
  try {
    const balance = yield call(EthereumApi.getEthereumBalance, privateKey);;
    yield put({ type: 'GET_ETHEREUM_BALANCE_SUCCEEDED', balance });
  } catch (error) {
    yield put({ type: 'GET_ETHEREUM_BALANCE_FAILED', error });
  }
}


function* getEthereumTransactions({ payload: { address } }) {
  try {
    const res = yield call(EthereumApi.getEthereumTransactions, address);
    const { currentUser } = (yield select()).default.auth;
    yield put({ type: 'GET_ETHEREUM_TRANSACTIONS_SUCCEEDED', transactions: res.results });
  } catch (error) {
    yield put({ type: 'GET_ETHEREUM_TRANSACTIONS_FAILED', error });
  }
}

function* addEthereumAddress({ payload: { address, privateKey, label } }) {
  // Ethereum doesn't support Add more Address to current wallet.
  console.log('ADDING ETHEREUM ADDRESS', address, privateKey, label);
  // try {
  //   const res = yield call(EthereumApi.addEthereumAddress, privateKey, address, label);
  //   const address = yield call(EthereumApi.getEthereumAddress, res.xpub, address, privateKey);
  //   yield put({ type: 'ADD_ETHEREUM_ADDRESS_SUCCEEDED', address });
  // } catch (error) {
  yield put({ type: 'ADD_ETHEREUM_ADDRESS_FAILED', error });
  // }
}
