import { put, takeEvery, call, all } from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';
import { parseTransactionsFromNode } from './escrowUtils';

export function* escrowSubscriber() {
  yield all([
    takeEvery('LOAD_ESCROW_TRANSACTIONS', loadEscrowTransactions),
    takeEvery('LOAD_ESCROW_AGENTS', loadEscrowAgents)
  ]);
}

function* loadEscrowTransactions(action) {
  const { username } = action.payload;

  // some dummy transactions
  const dummyTransactions = [
    {
      transactionID: 'a',
      amount: 'a',
      parties: 'a'
    },
    {
      transactionID: 'b',
      amount: 'c',
      parties: 'a'
    }
  ];

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
