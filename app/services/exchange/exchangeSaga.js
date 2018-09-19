import {
  FetchChain,
  TransactionBuilder
} from 'omnibazaarjs/es';
import {
  put,
  takeLatest,
  takeEvery,
  select,
  all,
  call
} from 'redux-saga/effects';
import {
  exchangeBtcFailed,
  exchangeBtcSucceeded,
  exchangeEthFailed,
  exchangeEthSucceeded
} from "./exchangeActions";

import { Apis } from 'omnibazaarjs-ws';
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
      sender: currentAcc.get('id')
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


function* exchangeBtc({ payload: { guid, password, walletIdx, amount }}) {
  try {
    const omnibazaar = yield call(fetchAccount, 'omnibazaar');
    const amountSatoshi = Math.ceil(amount * Math.pow(10, 8));
    const result = yield call(BitcoinApi.makePayment, guid, password, omnibazaar['btc_address'], amountSatoshi, walletIdx);
    yield broadcastExchange(result.txid, 'bitcoin');
    yield put(exchangeBtcSucceeded());
  } catch (error) {
    console.log("ERROR ", error)
    yield put(exchangeBtcFailed(error));
  }
}

function* exchangeEth({ payload: { privateKey, amount }}) {
  try {
    const omnibazaar = yield call(fetchAccount, 'omnibazaar');
    const result = yield call(EthereumApi.makeEthereumPayment, privateKey, omnibazaar.get('eth_address'), amount * 0.99);
    yield broadcastExchange(result, 'ethereum');
    yield put(exchangeEthSucceeded());
  } catch (error) {
    yield put(exchangeEthFailed(error));
  }
}

