import {
  FetchChain,
  TransactionBuilder
} from 'omnibazaarjs/es';
import {
  put,
  takeLatest,
  takeEvery,
  all,
  call,
  select
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { Apis } from 'omnibazaarjs-ws';
import request from 'request-promise-native';
import {
  exchangeBtcFailed,
  exchangeBtcSucceeded,
  exchangeEthFailed,
  exchangeEthSucceeded,
  exchangeRequestSale,
  exchangeRequestSaleFinished,
  exchangeMakeSaleSuccess
} from "./exchangeActions";
import { sendBTCMail, sendETHMail } from "./utils";
import { currencyConverter } from "../utils";

import * as BitcoinApi from "../blockchain/bitcoin/BitcoinApi";
import * as EthereumApi from "../blockchain/ethereum/EthereumApi";
import {generateKeyFromPassword} from "../blockchain/utils/wallet";
import {getStoredCurrentUser} from "../blockchain/auth/services";
import {fetchAccount} from "../blockchain/utils/miscellaneous";
import { getAuthHeaders } from '../listing/apis';
import config from '../../config/config';


// async function broadcastExchange(txId, coinName) {
//   const currentUser = getStoredCurrentUser();
//   const currentAcc = await FetchChain('getAccount', currentUser.username);
//   const tr = new TransactionBuilder();
//   tr.add_type_operation("exchange_create_operation", {
//       coin_name: coinName,
//       tx_id: txId,
//       sender: currentAcc.get('id'),
//       extensions: []
//   });
//   const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
//   await tr.set_required_fees();
//   await tr.add_signer(key.privKey, key.pubKey);
//   return await tr.broadcast();
// }

function* broadcastExchange(coinType, authHeader, txId) {
  const sender = (yield select()).default.auth.account.id;
  const response = yield request({
    uri: `${config.exchangeServer}/exchange`,
    json: true,
    headers: authHeader,
    method: 'POST',
    body: {
      coinType,
      sender,
      txId
    }
  });

  if (!response || typeof response.amount === 'undefined') {
    throw new Error('Create exchange fail');
  }

  return response.amount;
}

export function* exchangeSubscriber() {
  yield all([
    takeLatest('EXCHANGE_BTC', exchangeBtc),
    takeLatest('EXCHANGE_ETH', exchangeEth),
    takeEvery('EXCHANGE_REQUEST_SALE', requestSale)
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

    const { currentUser } = (yield select()).default.auth;
    const authHeader = yield getAuthHeaders(currentUser);

    yield requestSale();
    const xom = yield broadcastExchange('BTC', authHeader, result.txid);

    sendBTCMail(amount, xom, result.txid, formatMessage);
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
    const txHash = result.hash;

    let i = 5;
    let transaction = null;
    while (i > 0) {
      yield delay(5000);

      transaction = yield call(EthereumApi.getEthTransaction, txHash);
      if (transaction) {
        break;
      }
      i--;
    }
    
    if (!transaction) {
      throw new Error('eth_transaction_not_valid');
    }

    const { currentUser } = (yield select()).default.auth;
    const authHeader = yield getAuthHeaders(currentUser);

    yield requestSale();
    const xom = yield broadcastExchange('ETH', authHeader, txHash);

    sendETHMail(amount, xom, txHash, formatMessage);
    yield put(exchangeEthSucceeded());
  } catch (error) {
    console.log('ERROR ', error);
    yield put(exchangeEthFailed(error.message));
  }
}

function* requestSale() {
  try {
    const response = yield request({
      uri: `${config.exchangeServer}/sale`,
      json: true
    });
    if (!response || !response.phases) {
      throw new Error('Request exchange sale fail');
    }
    yield put(exchangeRequestSaleFinished(null, response));
  } catch (error) {
    console.log('ERROR ', error);
    yield put(exchangeRequestSaleFinished(error));
  }
}
