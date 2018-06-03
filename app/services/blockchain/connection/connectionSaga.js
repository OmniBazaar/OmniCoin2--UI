import {
  put,
  takeEvery,
  takeLatest,
  call,
  fork
} from 'redux-saga/effects';

import { nodesAddresses as nodes } from '../settings';
import { getDynGlobalObject as getDynObject, createConnection } from '../utils/miscellaneous';
import { connect as connectDht } from '../../search/dht/dhtSaga';

export function* subscriber() {
  yield takeEvery(
    'CONNECT',
    connectToNode
  );
  yield takeLatest(
    'GET_DYN_GLOBAL_OBJECT',
    getDynGlobalObject
  );
}

export function* connectToNode({ payload: { node } }) {
  try {
    const result = yield call(createConnection, node || nodes[0]);
    yield fork(connectDht);
    yield put({ type: 'CONNECT_SUCCEEDED', ...result });
  } catch (e) {
    yield put({ type: 'CONNECT_FAILED', error: e.message });
  }
}

export function* getDynGlobalObject() {
  try {
    const result = yield call(getDynObject);
    yield put({ type: 'DYN_GLOBAL_OBJECT_SUCCEEDED', dynGlobalObject: result });
  } catch (e) {
    yield put({ type: 'DYN_GLOBAL_OBJECT_FAILED', error: e.message });
  }
}
