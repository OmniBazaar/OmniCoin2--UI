import { put, takeEvery, call, all, takeLatest } from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';
import { updateAccount } from '../accountSettings/accountSaga';
import { parseEscrowTransactions } from './escrowUtils';
import { fetchAccount } from '../blockchain/utils/miscellaneous';

export function* escrowSubscriber() {
  yield all([
    takeEvery('LOAD_ESCROW_TRANSACTIONS', loadEscrowTransactions),
    takeLatest('LOAD_ESCROW_AGENTS', loadEscrowAgents),
    takeEvery('LOAD_MY_ESCROW_AGENTS', loadMyEscrowAgents),
    takeEvery('SET_MY_ESCROW_AGENTS', setMyEscrowAgents),
    takeEvery('GET_ESCROW_AGENTS_COUNT', getEscrowAgentsCount)
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
    console.log('RESULT OF UPDATE ', result);
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

