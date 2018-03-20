import { put, takeEvery, call, all } from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';

export function* escrowSubscriber() {
  yield all([
    takeEvery('LOAD_ESCROW_TRANSACTIONS', loadEscrowTransactions),
    takeEvery('LOAD_ESCROW_AGENTS', loadEscrowAgents)
  ]);
}

function* loadEscrowTransactions(action) {
  const { username } = action.payload;

  // get the transactions here
  const dummyTransactions = {
    123: {
      transactionID: '123',
      amount: '10.0',
      parties: 'You, AAA, BBB'
    }
  };

  const result = yield (Apis.instance().db_api().exec('get_escrow_objects', [username]));

  console.log('AAA': result);
  yield put({
    type: 'LOAD_ESCROW_TRANSACTIONS_DONE',
    transactions: dummyTransactions
  });
}

function* loadEscrowAgents(action) {
  const { username } = action.payload;

  // get the agents here
  const dummyAgents = {
    agentX: {
      username: 'agentX',
      approved: false
    }
  };

  yield put({
    type: 'LOAD_ESCROW_AGENTS_DONE',
    agents: dummyAgents
  });
}
