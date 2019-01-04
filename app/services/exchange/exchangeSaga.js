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
  exchangeMakeSaleSuccess,
  getBtcTransactionFeeFinished,
  resetTransactionFees,
  getEthTransactionFeeFinished
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
    takeEvery('EXCHANGE_REQUEST_SALE', requestSale),
    takeEvery('GET_BTC_TRANSACTION_FEE', getBtcTransactionFee),
    takeEvery('GET_ETH_TRANSACTION_FEE', getEthTransactionFee)
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
    yield updateSaleRates();
    yield checkAccountVerified();

    const omnicoin = yield call(fetchAccount, 'omnicoin');
    if (!omnicoin || !omnicoin['btc_address']) {
      throw new Error('invalid_omnicoin_btc_address');
    }

    const amountSatoshi = Math.round(amount * Math.pow(10, 8));
    const result = yield call(BitcoinApi.makePayment, guid, password, omnicoin['btc_address'], amountSatoshi, walletIdx);

    const { currentUser } = (yield select()).default.auth;
    const authHeader = yield getAuthHeaders(currentUser);

    yield updateSaleRates();
    const xom = yield broadcastExchange('BTC', authHeader, result.txid);

    const btcFee = yield BitcoinApi.getBtcTransactionFee(result.txid);
    sendBTCMail(amount, xom, result.txid, btcFee, formatMessage);
    yield put(exchangeBtcSucceeded());
    yield put(resetTransactionFees());
  } catch (error) {
    console.log('ERROR ', error);
    yield put(exchangeBtcFailed(
      error.message ? 
      error.message : 
      (
        error.error ? 
        error.error : 
        error
      )
    ));
    yield put(resetTransactionFees());
  }
}

function* exchangeEth({ payload: { privateKey, amount, estimatedFee, formatMessage }}) {
  try {
    yield updateSaleRates();
    yield checkAccountVerified();

    const omnicoin = yield call(fetchAccount, 'omnicoin');
    if (!omnicoin || !omnicoin['eth_address']) {
      throw new Error('invalid_omnicoin_eth_address');
    }
    const result = yield call(EthereumApi.makeEthereumPayment, privateKey, omnicoin['eth_address'], amount);
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

    yield updateSaleRates();
    const xom = yield broadcastExchange('ETH', authHeader, txHash);

    sendETHMail(amount, xom, txHash, estimatedFee, formatMessage);
    yield put(exchangeEthSucceeded());
    yield put(resetTransactionFees());
  } catch (error) {
    console.log('ERROR ', error);
    yield put(exchangeEthFailed(error.message));
    yield put(resetTransactionFees());
  }
}

function* requestSale({ payload: { onlyRates } }) {
  try {
    const response = yield request({
      uri: `${config.exchangeServer}/sale`,
      json: true
    });
    if (!response || !response.phases) {
      throw new Error('Request exchange sale fail');
    }
    yield put(exchangeRequestSaleFinished(null, response, onlyRates));
  } catch (error) {
    console.log('ERROR ', error);
    yield put(exchangeRequestSaleFinished(error));
  }
}

function* updateSaleRates() {
  yield requestSale({ payload: { onlyRates: true } });
}

function* getBtcTransactionFee({ payload: { id, guid, password, walletIdx, amount }}) {
  try {
    const omnicoin = yield call(fetchAccount, 'omnicoin');
    if (!omnicoin || !omnicoin['btc_address']) {
      throw new Error('invalid_omnicoin_btc_address');
    }

    const amountSatoshi = Math.round(amount * Math.pow(10, 8));
    const result = yield call(BitcoinApi.getTotalFee, guid, password, omnicoin['btc_address'], amountSatoshi, walletIdx);
    if (result.error) {
      throw result.error;
    }
    const fee = parseFloat(result.fee) / Math.pow(10, 8);
    yield put(getBtcTransactionFeeFinished(id, null, fee));
  } catch (err) {
    console.log('Get btc fee error', err);
    yield put(getBtcTransactionFeeFinished(id, err));
  }
}

function* getEthTransactionFee({ payload: { id, privateKey, amount } }) {
  try {
    const omnicoin = yield call(fetchAccount, 'omnicoin');
    if (!omnicoin || !omnicoin['eth_address']) {
      throw new Error('invalid_omnicoin_eth_address');
    }
    const result = yield call(EthereumApi.getEthFee, privateKey, omnicoin['eth_address'], amount);
    const { maxFee, estimateFee } = result;
    yield put(getEthTransactionFeeFinished(id, null, maxFee, estimateFee));
  } catch (err) {
    console.log('Get eth fee error', err);
    yield put(getEthTransactionFeeFinished(id, err));
  }
}
