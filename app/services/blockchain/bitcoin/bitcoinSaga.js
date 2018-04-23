import {
  put,
  call,
  all,
  takeEvery
} from 'redux-saga/effects';

import {
  blockchainInfoApiKey as apiKey,
  blockchainInfoAddress as address
} from '../settings';

export function* bitcoinSubscriber() {
  yield all([
    takeEvery('CREATE_WALLET', createWallet),
    takeEvery('GET_WALLETS', getWallets),
    takeEvery('MAKE_PAYMENT', makePayment),
    takeEvery('GET_BALANCE', getBalance)
  ])
}

function* createWallet({ payload: { password, privKey, label, email } }) {
  try {
    const response = call(fetch, `${address}/api/v2/create`, {
      method: 'post',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        password,
        api_key: apiKey,
        priv: privKey,
        label,
        email
      })
    })
  }
}

function* getWallets({ payload: { password } }) {

}

function* makePayment({ payload: { password, to, amount, from, fee } }) {

}

function* getBalance({ payload: { password, address } }) {

}
