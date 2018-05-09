import {
  FetchChain,
  TransactionHelper,
  Aes,
  TransactionBuilder
} from 'omnibazaarjs/es';
import {
  put,
  takeLatest,
  select,
  all,
} from 'redux-saga/effects';

import { generateKeyFromPassword } from '../blockchain/utils/wallet';

export function* transferSubscriber() {
  yield all([
    takeLatest('SUBMIT_TRANSFER', submitTransfer),
    takeLatest('CREATE_ESCROW_TRANSACTION', createEscrowTransaction)
  ]);
}

export function* submitTransfer(data) {
  const { currentUser } = (yield select()).default.auth;
  const sender_name_str = currentUser.username;
  const to_name_str = data.payload.data.to_name;
  const {
    amount, memo, reputation
  } = data.payload.data;

  try {
    const [sender_name, to_name] = yield Promise.all([
      FetchChain('getAccount', sender_name_str),
      FetchChain('getAccount', to_name_str),
    ]);

    const key1 = generateKeyFromPassword(sender_name.get('name'), 'active', currentUser.password);
    const tr = new TransactionBuilder();
    const memoFromKey = sender_name.getIn(['options', 'memo_key']);
    const memoToKey = to_name.getIn(['options', 'memo_key']);
    const nonce = TransactionHelper.unique_nonce_uint64();
    const memo_object = {
      from: memoFromKey,
      to: memoToKey,
      nonce,
      message: Aes.encrypt_with_checksum(
        key1.privKey,
        memoToKey,
        nonce,
        memo
      )
    };
    tr.add_type_operation('transfer', {
      from: sender_name.get('id'),
      to: to_name.get('id'),
      reputation_vote: parseInt(reputation),
      memo: memo_object,
      amount: {
        asset_id: '1.3.0',
        amount: amount * 100000
      },
    });

    tr.set_required_fees();
    tr.update_head_block();
    tr.add_signer(key1.privKey, key1.privKey.toPublicKey().toPublicKeyString('BTS'));
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
    yield put({ type: 'CREATE_ESCROW_TRANSACTION_SUCCEEDED' });
  } catch (error) {
    yield put({ type: 'CREATE_ESCROW_TRANSACTION_FAILED', error });
  }
}
