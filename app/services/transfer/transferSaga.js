import {
  FetchChain,
  TransactionHelper,
  Aes,
  TransactionBuilder
} from 'omnibazaarjs/es';
import {
  put,
  takeLatest,
  takeEvery,
  select,
  all
} from 'redux-saga/effects';
import _ from 'lodash';

import { generateKeyFromPassword } from '../blockchain/utils/wallet';
import { fetchAccount } from '../blockchain/utils/miscellaneous';

export function* transferSubscriber() {
  yield all([
    takeLatest('SUBMIT_TRANSFER', submitTransfer),
    takeLatest('CREATE_ESCROW_TRANSACTION', createEscrowTransaction),
    takeEvery('GET_COMMON_ESCROWS', getCommonEscrows)
  ]);
}

export function* submitTransfer(data) {
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
    const memoFromKey = senderName.getIn(['options', 'memo_key']);
    const memoToKey = toName.getIn(['options', 'memo_key']);
    const nonce = TransactionHelper.unique_nonce_uint64();
    const memoObject = {
      from: memoFromKey,
      to: memoToKey,
      nonce,
      message: Aes.encrypt_with_checksum(
        key.privKey,
        memoToKey,
        nonce,
        memo
      )
    };
    tr.add_type_operation('transfer', {
      from: senderName.get('id'),
      to: toName.get('id'),
      reputation_vote: parseInt(reputation),
      memo: memoObject,
      amount: {
        asset_id: '1.3.0',
        amount: amount * 100000
      },
    });

    yield tr.set_required_fees();
    yield tr.add_signer(key.privKey, key.pubKey);
    yield tr.broadcast();
    yield put({ type: 'SUBMIT_TRANSFER_SUCCEEDED' });
  } catch (error) {
    yield put({ type: 'SUBMIT_TRANSFER_FAILED', error });
  }
}

export function* createEscrowTransaction({
  payload:
  {
    expirationTime, buyer, seller, escrow, amount, transferToEscrow
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
    const tr = new TransactionBuilder();
    tr.add_type_operation('escrow_create_operation', {
      expiration_time: sec + expirationTime,
      buyer: buyerAcc.get('id'),
      seller: sellerAcc.get('id'),
      escrow: escrowAcc.get('id'),
      amount: {
        asset_id: '1.3.0',
        amount: amount * 100000
      },
      transfer_to_escrow: transferToEscrow
    });
    const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
    yield tr.set_required_fees();
    yield tr.add_signer(key.privKey, key.pubKey);
    yield tr.broadcast();
    yield put({ type: 'CREATE_ESCROW_TRANSACTION_SUCCEEDED' });
  } catch (error) {
    console.log('ERROR', error);
    yield put({ type: 'CREATE_ESCROW_TRANSACTION_FAILED', error: error.message });
  }
}

export function* getCommonEscrows({ payload: { fromAccount, toAccount } }) {
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
