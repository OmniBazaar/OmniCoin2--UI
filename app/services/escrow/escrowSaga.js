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
    takeEvery('SET_MY_ESCROW_AGENTS', setMyEscrowAgents)
  ]);
}

function* loadEscrowTransactions(action) {
  const { username } = action.payload;

  // some dummy transaction
  const dummyTransactions = [{
    123: {
      transactionID: '123',
      amount: '10.0',
      parties: 'You, AAA, BBB'
    }
  }];


//  const result = yield (Apis.instance().db_api().exec('get_escrow_objects', [username]));


  yield put({
    type: 'LOAD_ESCROW_TRANSACTIONS_DONE',
    transactions: dummyTransactions
  });

  /* use this code once we have some escrow transactions on node
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
  } */
}


function* loadEscrowAgents({payload: {start, limit, search_term}}) {
  try {
    const result = yield (Apis.instance().db_api().exec('filter_current_escrows', [start, limit, search_term]));
    const isAnythingLeft = limit - start === result.length;
    yield put({
      type: 'LOAD_ESCROW_AGENTS_SUCCEEDED',
      agents: result,
      isAnythingLeft
    });
  } catch (e) {
    yield put({
      type: 'LOAD_ESCROW_AGENTS_FAILED',
      error: e
    });
    console.log("SOME ERROR", e);
  }
}

function* loadMyEscrowAgents({payload: {username}}) {
  try {
    ChainStore.resetCache();
    const result = yield call(FetchChain, 'getAccount', username);
    yield put({
      type: 'LOAD_MY_ESCROW_AGENTS_SUCCEEDED',
      myAgents: result.get('escrows').map(name => { return {name} }),
    })
  } catch (e) {
    yield put({
      type: 'LOAD_MY_ESCROW_AGENTS_FAILED',
      error: e
    });
    console.log('ERROR ', e);
  }
}

function* setMyEscrowAgents({payload: {agents}}) {

}
