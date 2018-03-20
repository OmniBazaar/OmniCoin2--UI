import { put, takeEvery, call, all } from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';
import { parseTransactionsFromServer } from './escrowUtils';

export function* escrowSubscriber() {
  yield all([
    takeEvery('LOAD_ESCROW_TRANSACTIONS', loadEscrowTransactions),
    takeEvery('LOAD_ESCROW_AGENTS', loadEscrowAgents)
  ]);
}

function* loadEscrowTransactions(action) {
  const { username } = action.payload;

  // some dummy transactions
  const dummyTransactions = {
    'a': {
      transactionID: 'a',
      amount: 'a',
      parties: 'a'
    }
  };

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
      transactions: dummyTransactions
    });
  }
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
