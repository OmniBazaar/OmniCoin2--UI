import {
  FetchChain,
  TransactionBuilder
} from 'omnibazaarjs/es';
import {
  put,
  takeLatest,
  all,
  call,
  select
} from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';
import {
  exchangeBtcFailed,
  exchangeBtcSucceeded,
  exchangeEthFailed,
  exchangeEthSucceeded
} from "./exchangeActions";
import { sendBTCMail, sendETHMail } from "./utils";
import { currencyConverter } from "../utils";

import * as BitcoinApi from "../blockchain/bitcoin/BitcoinApi";
import * as EthereumApi from "../blockchain/ethereum/EthereumApi";
import {generateKeyFromPassword} from "../blockchain/utils/wallet";
import {getStoredCurrentUser} from "../blockchain/auth/services";
import {fetchAccount} from "../blockchain/utils/miscellaneous";


async function broadcastExchange(txId, coinName) {
  const currentUser = getStoredCurrentUser();
  const currentAcc = await FetchChain('getAccount', currentUser.username);
  const tr = new TransactionBuilder();
  tr.add_type_operation("exchange_create_operation", {
      coin_name: coinName,
      tx_id: txId,
      sender: currentAcc.get('id'),
      extensions: []
  });
  const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
  await tr.set_required_fees();
  await tr.add_signer(key.privKey, key.pubKey);
  return await tr.broadcast();
}

export function* exchangeSubscriber() {
  yield all([
    takeLatest('EXCHANGE_BTC', exchangeBtc),
    takeLatest('EXCHANGE_ETH', exchangeEth),
  ]);
}


function* checkAccountVerified() {
  const { currentUser } = (yield select()).default.auth;
  const account = yield Apis.instance().db_api().exec('get_account_by_name', [currentUser.username]);
  if (!account.verified) {
    throw new Error('not_verified');
  }
}

function* exchangeBtc({ payload: { guid, password, walletIdx, amount, formatMessage }}) {
  try {
    yield checkAccountVerified();

    const omnibazaar = yield call(fetchAccount, 'omnibazaar');

    const amountSatoshi = Math.ceil(amount * Math.pow(10, 8));
    const result = yield call(BitcoinApi.makePayment, guid, password, omnibazaar['btc_address'], amountSatoshi, walletIdx);
    yield broadcastExchange(result.txid, 'BTC');
    sendBTCMail(currencyConverter(amount, 'BITCOIN', 'OMNICOIN'), amount, result.txid, formatMessage);
    yield put(exchangeBtcSucceeded());
  } catch (error) {
    console.log('ERROR ', error);
    yield put(exchangeBtcFailed(error.message));
  }
}

function* exchangeEth({ payload: { privateKey, amount, formatMessage }}) {
  try {
    yield checkAccountVerified();

    const omnibazaar = yield call(fetchAccount, 'omnibazaar');
    const result = yield call(EthereumApi.makeEthereumPayment, privateKey, omnibazaar['eth_address'], amount);
    yield broadcastExchange(result.hash, 'ETH');
    sendETHMail(currencyConverter(amount, 'ETHEREUM', 'OMNICOIN'), amount, result.hash, formatMessage);
    yield put(exchangeEthSucceeded());
  } catch (error) {
    console.log('ERROR ', error);
    yield put(exchangeEthFailed(error.message));
  }
}
