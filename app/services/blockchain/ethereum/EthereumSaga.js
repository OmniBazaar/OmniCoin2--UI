import {
  put,
  call,
  all,
  takeEvery,
  select
} from 'redux-saga/effects';

import {
  delay
} from 'redux-saga'

import * as EthereumApi from './EthereumApi';
import { persitEthereumWalletData, getEthereumWalletData } from './EthereumServices';
import { getRecentTransactions } from '../../accountSettings/accountActions';
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
    yield call(persitEthereumWalletData, res.address, res.privateKey, res.mnemonic, currentUser);
    yield put({ type: 'CREATE_ETHEREUM_WALLET_SUCCEEDED', address: res.address, brainKey: res.mnemonic });
    yield put(getRecentTransactions("ethereum"))
  } catch (error) {
    console.log('ERROR ', error);
    yield put({ type: 'CREATE_ETHEREUM_WALLET_FAILED', error });
  }
}

function* connectEthereumWallet({ payload: { walletPrivateKey, walletBrainKey } }) {
  try {
    const res = yield call(EthereumApi.getEthereumWallets, walletPrivateKey, walletBrainKey);
    const { address, privateKey, mnemonic: brainKey } = res;
    const { currentUser } = (yield select()).default.auth;

    yield call(persitEthereumWalletData, address, privateKey, brainKey, currentUser);
    yield put(connectEthereumWalletFinish());
    yield put({ type: 'GET_ETHEREUM_BALANCE', payload: { address, privateKey }});
    yield put({ type: 'GET_ETHEREUM_WALLETS_SUCCEEDED', wallets: res, address, privateKey, brainKey });
    yield put(getRecentTransactions("ethereum"))
  } catch (error) {
    console.log('Connect Ethereum wallet error', error);
    // delay for 1 ms because of not showing toastr error
    yield delay(1)
    yield put(connectEthereumWalletFinish(error));
  }
}

function* getEthereumWallets({ payload: { privateKey, brainKey } }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    if (privateKey || brainKey) {
      const res = yield call(EthereumApi.getEthereumWallets, privateKey, brainKey);
      yield put({ type: 'GET_ETHEREUM_WALLETS_SUCCEEDED', wallets: res, privateKey, brainKey });
    } else {
      const walletData = yield call(getEthereumWalletData, currentUser);
      if (walletData) {
        const { address, privateKey, brainKey } = walletData;
        const res = yield call(EthereumApi.getEthereumWallets, privateKey, brainKey);
        yield put({ type: 'GET_ETHEREUM_BALANCE', payload: { address, privateKey }});
        yield put({ type: 'GET_ETHEREUM_WALLETS_SUCCEEDED', wallets: res, address, privateKey, brainKey });
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
