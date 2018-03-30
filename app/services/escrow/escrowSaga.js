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

 // const result = yield (Apis.instance().db_api().exec('get_escrow_objects', [username]));

  yield put({
    type: 'LOAD_ESCROW_TRANSACTIONS_DONE',
    transactions: dummyTransactions
  });
}

function* loadEscrowAgents({payload: {start, limit, search_term}}) {
  try {
    const result = yield (Apis.instance().db_api().exec('get_current_escrows', [start, limit, search_term]));
    const isAnythingLeft = limit - start === result.length;
    yield put({
      type: 'LOAD_ESCROW_AGENTS_DONE',
      agents: result.map(name => {name}),
      isAnythingLeft
    });
  } catch (e) {
    console.log("SOME ERROR", e);
  }

}
