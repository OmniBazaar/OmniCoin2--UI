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
  fork,
  call
} from 'redux-saga/effects';
import _ from 'lodash';
import * as BitcoinApi from '../blockchain/bitcoin/BitcoinApi';
import { Apis } from 'omnibazaarjs-ws';

import { generateKeyFromPassword } from '../blockchain/utils/wallet';
import { fetchAccount, memoObject } from '../blockchain/utils/miscellaneous';
import { makePayment } from '../blockchain/bitcoin/bitcoinSaga';

export function* transferSubscriber() {
  yield all([
    takeLatest('SUBMIT_TRANSFER', submitTransfer),
    takeLatest('CREATE_ESCROW_TRANSACTION', createEscrowTransaction),
    takeEvery('GET_COMMON_ESCROWS', getCommonEscrows),
    takeEvery('SALE_BONUS', saleBonus)
  ]);
}

function* submitOmniCoinTransfer(data) {
  const { currentUser } = (yield select()).default.auth;
  const senderNameStr = currentUser.username;
  const toNameStr = data.payload.data.toName;
  const {
    amount, memo, reputation
  } = data.payload.data;

  try {
    const [senderName, toName] = yield Promise.all([
      FetchChain('getAccount', senderNameStr),
      FetchChain('getAccount', toNameStr),
    ]);

    const key = generateKeyFromPassword(senderName.get('name'), 'active', currentUser.password);
    const tr = new TransactionBuilder();
    const operationObj = {
      from: senderName.get('id'),
      to: toName.get('id'),
      reputation_vote: parseInt(reputation),
      memo: memoObject(memo, senderName, toName, key.privKey),
      amount: {
        asset_id: '1.3.0',
        amount: amount * 100000
      },
    };
    if (data.payload.data.listingId) {
      operationObj.listing = data.payload.data.listingId;
      operationObj.listing_count = parseInt(data.payload.data.listingCount);
    }
    tr.add_type_operation('transfer', operationObj);
    yield tr.set_required_fees();
    yield tr.add_signer(key.privKey, key.pubKey);
    yield tr.broadcast();
    yield put({ type: 'SUBMIT_TRANSFER_SUCCEEDED' });
  } catch (error) {
    console.log('ERROR', error);
    yield put({ type: 'SUBMIT_TRANSFER_FAILED', error });
  }
}

function* submitBitcoinTransfer(data) {
  const {
    guid,
    password,
    toBCName,
    amount,
    fromName
  } = data.payload.data;
  const fee = 0;

  try {
    const res = yield call(BitcoinApi.makePayment, guid, password, toBCName, amount, fromName, fee);
    yield put({ type: 'MAKE_PAYMENT_SUCCEEDED', res });
  } catch (error) {
    yield put({ type: 'MAKE_PAYMENT_FAILED', error });
    console.log('ERROR', error);
  }
}

export function* submitTransfer(data) {
  const currencySelectedStr = (yield select()).default.transfer.transferCurrency;
  switch (currencySelectedStr) {
    case 'omnicoin':
      yield fork(submitOmniCoinTransfer, data);
      break;
    case 'bitcoin':
      yield fork(submitBitcoinTransfer, data);
      break;
    default:
      yield fork(submitBitcoinTransfer, data);
  }
}


function* createEscrowTransaction({ payload: {
    data : {
      expirationTime,
      buyer,
      toName: seller,
      escrow,
      amount,
      transferToEscrow,
      memo,
      listingId,
      listingCount
    }
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
      memo: memoObject(memo, buyerAcc, sellerAcc, key.privKey),
      amount: {
        asset_id: '1.3.0',
        amount: amount * 100000
      },
      transfer_to_escrow: transferToEscrow
    };
    if (listingId) {
      operationObj.listing = listingId;
      operationObj.listing_count = listingCount;
    }
    tr.add_type_operation('escrow_create_operation', operationObj);
    yield tr.set_required_fees();
    yield tr.add_signer(key.privKey, key.pubKey);
    yield tr.broadcast();
    yield put({ type: 'CREATE_ESCROW_TRANSACTION_SUCCEEDED' });
  } catch (error) {
    console.log('ERROR', error);
    yield put({ type: 'CREATE_ESCROW_TRANSACTION_FAILED', error: error.message });
  }
}

function* getCommonEscrows({ payload: { fromAccount, toAccount } }) {
  try {
    if (!fromAccount || !toAccount) {
      return yield put({ type: 'GET_COMMON_ESCROWS_SUCCEEDED', commonEscrows: [] });
    }
    let [fromEscrows, toEscrows] = yield Promise.all([
      fetchAccount(fromAccount),
      fetchAccount(toAccount)
    ]).then(res => res.map(el => el.escrows));
    fromEscrows = yield Promise.all(fromEscrows.map(el => FetchChain('getAccount', el))).then(res => res.map(el => el.toJS()));
    toEscrows = yield Promise.all(toEscrows.map(el => FetchChain('getAccount', el))).then(res => res.map(el => el.toJS()));
    yield put({ type: 'GET_COMMON_ESCROWS_SUCCEEDED', commonEscrows: _.intersectionBy(fromEscrows, toEscrows, 'id') });
  } catch (error) {
    console.log('ERROR ', error);
    yield put({ type: 'GET_COMMON_ESCROWS_FAILED', error: error.message });
  }
}

function* saleBonus({ payload: { seller, buyer }}) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const [currUserAcc, sellerAcc, buyerAcc] = yield Promise.all([
      FetchChain('getAccount', currentUser.username),
      FetchChain('getAccount', seller),
      FetchChain('getAccount', buyer)
    ]);
    const isAvailable = yield Apis.instance().db_api().exec('is_sale_bonus_available',
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
