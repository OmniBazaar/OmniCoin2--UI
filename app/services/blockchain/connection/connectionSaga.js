import {
  put,
  takeEvery,
  takeLatest,
  call,
  all,
  select
} from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';
import  { FetchChain } from 'omnibazaarjs/es';
import { ipcRenderer } from 'electron';


import { restartNodeFailed, restartNodeSucceeded } from "./connectionActions";
import { getDynGlobalObject as getDynObject, createConnection } from '../utils/miscellaneous';
import { generateKeyFromPassword } from "../utils/wallet";

export function* subscriber() {
  yield all([
    takeEvery('CONNECT', connectToNode),
    takeLatest('GET_DYN_GLOBAL_OBJECT', getDynGlobalObject),
    takeLatest('RESTART_NODE', restartNode)
  ]);
}

export function* connectToNode({ payload: { nodes } }) {
  try {
    const result = yield call(createConnection, nodes);
    yield put({ type: 'CONNECT_SUCCEEDED', ...result });
  } catch (e) {
    yield put({ type: 'CONNECT_FAILED', error: e.message });
  }
}

function* getDynGlobalObject() {
  try {
    const result = yield call(getDynObject);
    yield put({ type: 'DYN_GLOBAL_OBJECT_SUCCEEDED', dynGlobalObject: result });
  } catch (e) {
    yield put({ type: 'DYN_GLOBAL_OBJECT_FAILED', error: e.message });
  }
}

function* restartNode() {
  try {
    const { currentUser } = (yield select()).default.auth;
    const { preferences } = (yield select()).default.preferences;
    const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
    const account = yield call(FetchChain, 'getAccount', currentUser.username);
    const witness = yield Apis.instance().db_api().exec('get_witness_by_account', [account.get('id')]);
    if (witness && !preferences.autorun) {
      ipcRenderer.send('restart-node', witness.id, key.pubKey, key.privKey.toWif());
    }
    yield put(restartNodeSucceeded())
  } catch (e) {
    console.log('ERROR ', e);
    yield put(restartNodeFailed(e));
  }
}
