import { put, takeEvery, call, all, takeLatest } from 'redux-saga/effects';
import { FetchChain, ChainStore } from 'omnibazaarjs/es';
import { Apis } from 'omnibazaarjs-ws';
import { updateAccount } from '../accountSettings/accountSaga';
import { parseTransactionsFromNode } from './escrowUtils';

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
    
  try
  {
    const escrowObjects = yield (Apis.instance().db_api().exec('get_escrow_objects', [username]));

    yield put({
      type: 'LOAD_ESCROW_TRANSACTIONS_DONE',
      transactions: parseTransactionsFromNode(escrowObjects)
    });
  }
  catch (err) {
    yield put({
      type: 'LOAD_ESCROW_TRANSACTIONS_DONE',
      transactions: []
    });
  }
}


function* loadEscrowAgents({ payload: { start, limit, searchTerm } }) {
  try {
    const result = yield (Apis.instance().db_api().exec('filter_current_escrows', [start, limit, searchTerm]));
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
    ChainStore.resetCache();
    const result = yield call(FetchChain, 'getAccount', username);
    yield put({
      type: 'LOAD_MY_ESCROW_AGENTS_SUCCEEDED',
      myAgents: result.get('escrows').toJS().map(item => ({ id: item })),
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
    console.log('UPDATING AGENTS ', agents);
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
    yield put({
      type: 'GET_ESCROW_AGENTS_SUCCEEDED',
      count: 4
    });
  } catch (e) {
    console.log('ERROR ', e);
    yield put({
      type: 'GET_ESCROW_AGENTS_FAILED',
      error: e
    });
  }
}

