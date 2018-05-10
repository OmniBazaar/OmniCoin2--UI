import {
  put,
  takeEvery,
  call,
  all,
  takeLatest,
  select
} from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';
import { TransactionBuilder, FetchChain } from 'omnibazaarjs/es';

import { updateAccount } from '../accountSettings/accountSaga';
import { parseEscrowTransactions } from './escrowUtils';
import { fetchAccount } from '../blockchain/utils/miscellaneous';
import { generateKeyFromPassword } from '../blockchain/utils/wallet';

export function* escrowSubscriber() {
  yield all([
    takeEvery('LOAD_ESCROW_TRANSACTIONS', loadEscrowTransactions),
    takeLatest('LOAD_ESCROW_AGENTS', loadEscrowAgents),
    takeEvery('LOAD_MY_ESCROW_AGENTS', loadMyEscrowAgents),
    takeEvery('SET_MY_ESCROW_AGENTS', setMyEscrowAgents),
    takeEvery('GET_ESCROW_AGENTS_COUNT', getEscrowAgentsCount),
    takeEvery('RELEASE_ESCROW_TRANSACTION', releaseEscrowTransaction),
    takeEvery('RETURN_ESCROW_TRANSACTION', returnEscrowTransaction)
  ]);
}

function* loadEscrowTransactions(action) {
  const { username } = action.payload;
  try {
    const escrowObjects = yield (Apis.instance().db_api().exec('get_escrow_objects', [username]));
    yield put({
      type: 'LOAD_ESCROW_TRANSACTIONS_DONE',
      transactions: yield call(parseEscrowTransactions, escrowObjects, username)
    });
  } catch (e) {
    yield put({
      type: 'LOAD_ESCROW_TRANSACTIONS_FAILED',
      error: e
    });
  }
}


function* loadEscrowAgents({
  payload: {
    start, limit, searchTerm, filters
  }
}) {
  try {
    const result = yield (Apis.instance().db_api().exec('filter_current_escrows', [
      start,
      limit,
      searchTerm,
      {
        any_user_i_give_pos_rating: filters.positiveRating,
        any_user_i_votes_as_trans_proc: filters.transactionProcessor,
        any_user_who_is_trans_proc: filters.activeTransactionProcessor
      }
    ]));
    yield put({
      type: 'LOAD_ESCROW_AGENTS_SUCCEEDED',
      agents: result
    });
  } catch (e) {
    yield put({
      type: 'LOAD_ESCROW_AGENTS_FAILED',
      error: e
    });
    console.log('ERROR ', e);
  }
}

function* loadMyEscrowAgents({ payload: { username } }) {
  try {
    const result = yield call(fetchAccount, username);
    yield put({
      type: 'LOAD_MY_ESCROW_AGENTS_SUCCEEDED',
      myAgents: result.escrows.map(item => ({ id: item })),
    });
  } catch (e) {
    yield put({
      type: 'LOAD_MY_ESCROW_AGENTS_FAILED',
      error: e
    });
    console.log('ERROR ', e);
  }
}

function* setMyEscrowAgents({ payload: { agents } }) {
  try {
    const result = yield updateAccount({
      escrows: agents.map(agent => agent.id)
    });
    yield put({
      type: 'SET_MY_ESCROW_AGENTS_SUCCEEDED'
    });
  } catch (e) {
    console.log('ERROR ', e);
    yield put({
      type: 'SET_MY_ESCROW_AGENTS_FAILED',
      error: e
    });
  }
}

function* getEscrowAgentsCount() {
  try {
    const result = yield Apis.instance().db_api().exec('get_number_of_escrows', []);
    yield put({
      type: 'GET_ESCROW_AGENTS_COUNT_SUCCEEDED',
      count: result
    });
  } catch (e) {
    console.log('ERROR ', e);
    yield put({
      type: 'GET_ESCROW_AGENTS_COUNT_FAILED',
      error: e
    });
  }
}


function* releaseEscrowTransaction({ payload: { escrowObject } }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const [payingAcc, buyerAcc, escrowAcc]  = yield Promise.all([
      FetchChain('getAccount', currentUser.username),
      FetchChain('getAccount', escrowObject.buyer),
      FetchChain('getAccount', escrowObject.escrow)
    ]);
    const tr = new TransactionBuilder();
    tr.add_type_operation('escrow_release_operation', {
      fee_paying_account: payingAcc.get('id'),
      escrow: escrowObject.transactionID,
      buyer_account: buyerAcc.get('id'),
      escrow_account: escrowAcc.get('id')
    });
    const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
    tr.set_required_fees().then(() => {
      tr.add_signer(key.privKey, key.pubKey);
      tr.broadcast();
    });
    yield put({ type: 'RELEASE_ESCROW_TRANSACTION_SUCCEEDED', releasedTransaction: escrowObject });
  } catch (error) {
    console.log('ERROR ', error);
    yield put({ type: 'RELEASE_ESCROW_TRANSACTION_FAILED', error });
  }
}

function* returnEscrowTransaction({ payload: { escrowObject } }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const [payingAcc, sellerAcc, escrowAcc] = yield Promise.all([
      FetchChain('getAccount', currentUser.username),
      FetchChain('getAccount', escrowObject.seller),
      FetchChain('getAccount', escrowObject.escrow)
    ]);
    const tr = new TransactionBuilder();
    tr.add_type_operation('escrow_return_operation', {
      fee_paying_account: payingAcc.get('id'),
      escrow: escrowObject.transactionID,
      seller_account: sellerAcc.get('id'),
      escrow_account: escrowAcc.get('id')
    });
    const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
    tr.set_required_fees().then(() => {
      tr.add_signer(key.privKey, key.pubKey);
      tr.broadcast();
    });
    yield put({ type: 'RETURN_ESCROW_TRANSACTION_SUCCEEDED', returnedTransaction: escrowObject });
  } catch (error) {
    console.log('ERROR RETURN', error);
    yield put({ type: 'RETURN_ESCROW_TRANSACTION_FAILED', error });
  }
}

