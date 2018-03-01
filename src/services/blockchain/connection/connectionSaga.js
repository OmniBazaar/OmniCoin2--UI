import {put, takeEvery} from 'redux-saga/effects';
import { createConnection } from './connection';

export function* subscriber() {
    yield takeEvery(
        'CONNECT',
        connectToNode
    );
}

export function* connectToNode(action) {
   try {
       let result = yield createConnection(action.payload.node);
       yield put({type: 'CONNECT_SUCCEEDED', result})
   } catch(e) {
        yield put({type: 'CONNECT_FAILED', e});
   }
}