import { call, put, takeEvery } from 'redux-saga/effects';
import { init } from '../../../utils/dht-connector';

export function* dhtSubscriber() {
  yield takeEvery('DHT_CONNECT', connect);
}

export function* connect() {
  try {
    const connector = yield call(init, {});

    yield put({ type: 'DHT_CONNECT_SUCCEEDED', connector });
  } catch (e) {
    yield put({ type: 'DHT_CONNECT_FAILED', error: e.message });
  }
}
