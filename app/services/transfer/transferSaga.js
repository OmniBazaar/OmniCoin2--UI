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

import _ from 'lodash';
import { Apis } from 'omnibazaarjs-ws';

import {
  omnicoinTransferSucceeded,
  omnicoinTransferFailed,
  bitcoinTransferSucceeded,
  bitcoinTransferFailed,
  ethereumTransferSucceeded,
  ethereumTransferFailed,
  saleBonus as saleBonusAction
} from "./transferActions";

import * as BitcoinApi from '../blockchain/bitcoin/BitcoinApi';
import * as EthereumApi from '../blockchain/ethereum/EthereumApi';

import { generateKeyFromPassword } from '../blockchain/utils/wallet';
import { fetchAccount, memoObject } from '../blockchain/utils/miscellaneous';
import { makePayment } from '../blockchain/bitcoin/bitcoinSaga';
import { makeEthereumPayment } from '../blockchain/ethereum/EthereumSaga';
import { sendOBFeesByEth } from '../blockchain/ethereum/EthereumServices';
import { getAccountBalance } from '../blockchain/wallet/walletActions';
import { TOKENS_IN_XOM } from '../../utils/constants';
import {addPurchase} from "../marketplace/myPurchases/myPurchasesActions";
import { sendPurchaseInfoMail } from "../mail/mailActions";

export function* transferSubscriber() {
  yield all([
    takeLatest('OMNICOIN_TRANSFER', omnicoinTransfer),
    takeLatest('BITCOIN_TRANSFER', bitcoinTransfer),
    takeLatest('ETHEREUM_TRANSFER', ethereumTransfer),
    takeLatest('CREATE_ESCROW_TRANSACTION', createEscrowTransaction),
    takeEvery('GET_COMMON_ESCROWS', getCommonEscrows),
    takeEvery('SALE_BONUS', saleBonus)
  ]);
}

function* omnicoinTransfer({payload: {
  to, amount, memo, reputation, listingId, listingTitle, listingCount
}}) {
  const { currentUser } = (yield select()).default.auth;
  let buyer = currentUser.username,
      seller = to;
  try {
    const [fromAcc, toAcc] = yield Promise.all([
      FetchChain('getAccount', currentUser.username),
      FetchChain('getAccount', to),
    ]);
    const key = generateKeyFromPassword(fromAcc.get('name'), 'active', currentUser.password);
    const tr = new TransactionBuilder();
    const operationObj = {
      from: fromAcc.get('id'),
      to: toAcc.get('id'),
      reputation_vote: parseInt(reputation),
      amount: {
        asset_id: '1.3.0',
        amount: Math.ceil(amount * TOKENS_IN_XOM)
      },
    };
    if (memo && memo.trim()) {
      operationObj.memo = memoObject(memo.trim(), fromAcc, toAcc, key.privKey);
    }
    if (listingId) {
      operationObj.listing = listingId;
      operationObj.listing_count = parseInt(listingCount);
    }
    tr.add_type_operation('transfer', operationObj);
    yield tr.set_required_fees();
    yield tr.add_signer(key.privKey, key.pubKey);
    yield tr.broadcast();
    yield put(omnicoinTransferSucceeded());
    yield put(getAccountBalance(fromAcc.toJS()));
    if (listingId) {
      yield addPurchaseAndSendMails({
        seller,
        buyer,
        amount,
        listingId,
        listingCount,
        listingTitle,
        currency: 'omnicoin'
      });
      yield put(saleBonusAction(seller, buyer))
    }
  } catch (error) {
    let e = JSON.stringify(error);
    if (error.message && error.message.indexOf('Insufficient Balance' !== -1)) {
      e = 'Not enough funds';
    }
    yield put(omnicoinTransferFailed(e));
  }
}

function* bitcoinTransfer({ payload: {
  toBitcoinAddress, toName, guid, password, walletIdx, amount, listingId, listingTitle, listingCount, privateKey
}}) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const buyer = currentUser.username,
          seller = toName;
    const amountSatoshi = Math.ceil(amount * Math.pow(10, 8));
    if (privateKey) {
      yield call(BitcoinApi.sendTransaction, walletIdx, toBitcoinAddress, privateKey, parseFloat(amount));
    } else {
      yield call(BitcoinApi.makePayment, guid, password, toBitcoinAddress, amountSatoshi, walletIdx);
    }
    
    yield put(bitcoinTransferSucceeded());
    if (listingId) {
      yield addPurchaseAndSendMails({
        seller,
        buyer,
        amount,
        listingId,
        listingCount,
        listingTitle,
        currency: 'bitcoin'
      });
      yield put(saleBonusAction(seller, buyer))
    }
  } catch (error) {
    console.log(error);
    yield put(bitcoinTransferFailed({...error}));
  }
}

function* ethereumTransfer({payload: {
  toEthereumAddress, toName, privateKey, amount, listingId, listingTitle, listingCount
} }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const buyer = currentUser.username,
          seller = toName;
    yield call(EthereumApi.makeEthereumPayment, privateKey, toEthereumAddress, amount * 0.99);
    yield put(ethereumTransferSucceeded());
    if (listingId) {
      sendOBFeesByEth(amount, toName, currentUser.username, listingId, privateKey);
      yield addPurchaseAndSendMails({
        seller,
        buyer,
        amount,
        listingId,
        listingCount,
        listingTitle,
        currency: 'ethereum'
      });
      yield put(saleBonusAction(seller, buyer))
    }
    console.log("Ether res", res);
  } catch (error) {
    console.log('ERROR', error);
    if (error.message) {
      yield put(ethereumTransferFailed(error.message));
    } else {
      yield put(ethereumTransferFailed(error));
    }
  }
}

const weightAndSizeKeys = ['weight', 'width', 'height', 'length'];
function* addPurchaseAndSendMails({seller, buyer, amount, listingId, listingCount, listingTitle, currency}) {
  const { listingDetail } = (yield select()).default.listing;
  const purchaseObject = {
    date: new Date(),
    seller,
    buyer,
    amount,
    listingId,
    listingCount,
    listingTitle,
    currency
  };
  const { buyerAddress } = (yield select()).default.transfer;
  const shipment = {
    buyerAddress
  };
  const { shippingRates, selectedShippingRateIndex } = (yield select()).default.shipping;
  if (shippingRates && shippingRates.length && selectedShippingRateIndex > -1) {
    const rate = shippingRates[selectedShippingRateIndex];
    if (rate) {
      shipment.shippingCost = {...rate};
    }
  }
  purchaseObject.shipment = shipment;

  weightAndSizeKeys.forEach(key => {
    if (listingDetail[key]) {
      purchaseObject.weightAndSize = {
        ...purchaseObject.weightAndSize,
        [key]: listingDetail[key],
        [`${key}_unit`]: listingDetail[`${key}_unit`]
      };
    }
  });

  yield put(addPurchase(purchaseObject));
    yield put(sendPurchaseInfoMail(buyer, buyer, JSON.stringify(purchaseObject)));
  }


function* createEscrowTransaction({ payload: {
    buyer, seller, escrow, amount, memo, transferToEscrow, expirationTime, listingId, listingCount
  }
}) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const [sec, buyerAcc, sellerAcc, escrowAcc] = yield Promise.all([
      TransactionBuilder.fetch_base_expiration_sec(),
      FetchChain('getAccount', buyer),
      FetchChain('getAccount', seller),
      FetchChain('getAccount', escrow)
    ]);
    const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
    const tr = new TransactionBuilder();
    const operationObj = {
      expiration_time: sec + expirationTime,
      buyer: buyerAcc.get('id'),
      seller: sellerAcc.get('id'),
      escrow: escrowAcc.get('id'),
      amount: {
        asset_id: '1.3.0',
        amount: Math.ceil(amount * TOKENS_IN_XOM)
      },
      transfer_to_escrow: transferToEscrow
    };
    if (memo && memo.trim()) {
      operationObj.memo = memoObject(memo.trim(), buyerAcc, sellerAcc, key.privKey);
    }
    if (listingId) {
      operationObj.listing = listingId;
      operationObj.listing_count = Number(listingCount);
    }

    tr.add_type_operation('escrow_create_operation', operationObj);
    yield tr.set_required_fees();
    yield tr.add_signer(key.privKey, key.pubKey);
    yield tr.broadcast();
    yield put({ type: 'CREATE_ESCROW_TRANSACTION_SUCCEEDED' });
  } catch (error) {
    const errorMsg = error.message.indexOf('Insufficient Balance') !== -1 ? 'Not enough funds' : error.message;
    yield put({ type: 'CREATE_ESCROW_TRANSACTION_FAILED', error: errorMsg });
  }
}

function* getCommonEscrows({ payload: { from, to } }) {
  try {
    if (!from || !to) {
      return yield put({ type: 'GET_COMMON_ESCROWS_SUCCEEDED', commonEscrows: [] });
    }
    const [fromAcc, toAcc] = yield Promise.all([
      fetchAccount(from),
      fetchAccount(to)
    ]);
    const [implicitFromEscrows, implicitToEscrows] = yield Promise.all([
      Apis.instance().db_api().exec('get_implicit_escrows', [fromAcc.id]),
      Apis.instance().db_api().exec('get_implicit_escrows', [toAcc.id])
    ]);
    let fromEscrows = _.union(fromAcc.escrows, implicitFromEscrows);
    let toEscrows = _.union(toAcc.escrows, implicitToEscrows);
    fromEscrows = yield Promise.all(fromEscrows.map(el => FetchChain('getAccount', el))).then(res => res.map(el => el.toJS()));
    toEscrows = yield Promise.all(toEscrows.map(el => FetchChain('getAccount', el))).then(res => res.map(el => el.toJS()));
    yield put({ type: 'GET_COMMON_ESCROWS_SUCCEEDED', commonEscrows: _.intersectionBy(fromEscrows, toEscrows, 'id') });
  } catch (error) {
    yield put({ type: 'GET_COMMON_ESCROWS_FAILED', error: error.message });
  }
}

function* saleBonus({ payload: { seller, buyer } }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const [currUserAcc, sellerAcc, buyerAcc] = yield Promise.all([
      FetchChain('getAccount', currentUser.username),
      FetchChain('getAccount', seller),
      FetchChain('getAccount', buyer)
    ]);
    const isAvailable = yield Apis.instance().db_api().exec(
      'is_sale_bonus_available',
      [sellerAcc.get('id'), buyerAcc.get('id')]
    );
    if (isAvailable) {
      const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
      const tr = new TransactionBuilder();
      tr.add_type_operation('sale_bonus_operation', {
        payer: currUserAcc.get('id'),
        seller: sellerAcc.get('id'),
        buyer: buyerAcc.get('id'),
      });
      yield tr.set_required_fees();
      yield tr.add_signer(key.privKey, key.pubKey);
      yield tr.broadcast();
    }
  } catch (error) {
    console.log('ERROR ', error);
  }
}
