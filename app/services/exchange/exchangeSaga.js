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
    // takeEvery('EXCHANGE_REQUEST_RATES', requestRates),
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

// function* makeSale(transactionResult, currency, amount) {
//   if (!transactionResult) {
//     return;
//   }

//   try {
//     const exchangeId = transactionResult[0].trx.operation_results[0][1];
//     const { currentUser } = (yield select()).default.auth;
//     const authHeader = yield getAuthHeaders(currentUser);
//     const response = yield request({
//       uri: `${config.exchangeServer}/sale/makeSale`,
//       method: 'POST',
//       json: true,
//       headers: authHeader,
//       body: {
//         exchangeId,
//         currency,
//         amount
//       }
//     });
//     if (!response) {
//       throw new Error('Request make sale fail');
//     }
//     if (response.error) {
//       throw new Error(response.error);
//     }
//     const { progress } = response;
//     yield put(exchangeMakeSaleSuccess(progress));
//   } catch (err) {
//     console.log('Make sale error', err);
//   }
// }

function* exchangeBtc({ payload: { guid, password, walletIdx, amount, formatMessage }}) {
  try {
    yield checkAccountVerified();

    const omnibazaar = yield call(fetchAccount, 'omnibazaar');

    const amountSatoshi = Math.ceil(amount * Math.pow(10, 8));
    const result = yield call(BitcoinApi.makePayment, guid, password, omnibazaar['btc_address'], amountSatoshi, walletIdx);
    const trx = yield broadcastExchange(result.txid, 'BTC');

    sendBTCMail(amount, result.txid, formatMessage);
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

    const trx = yield broadcastExchange(txHash, 'ETH');

    sendETHMail(amount, txHash, formatMessage);
    yield put(exchangeEthSucceeded());
  } catch (error) {
    console.log('ERROR ', error);
    yield put(exchangeEthFailed(error.message));
  }
}

// function* requestRates() {
//   try {
//     const response = yield request({
//       uri: `${config.exchangeServer}/rate/rates`,
//       json: true
//     });
//     if (!response || !response.rates) {
//       throw new Error('Request rates fail');
//     }
//     yield put(exchangeRequestRatesFinished(null, response.rates));
//   } catch (error) {
//     console.log('ERROR ', error);
//     yield put(exchangeRequestRatesFinished(error));
//   }
// }

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
