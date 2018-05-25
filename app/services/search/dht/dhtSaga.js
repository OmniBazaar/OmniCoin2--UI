import {
  all,
  call,
  put,
  takeEvery,
  select
} from 'redux-saga/effects';
import DHTConnector from '../../../utils/dht-connector';
import SearchHistory from '../searchHistory';

const dhtConnector = new DHTConnector();

export function* dhtSubscriber() {
  yield all([
    takeEvery('DHT_CONNECT', connect),
    takeEvery('DHT_GET_PEERS_FOR', getPeersFor),
  ]);
}

export function* connect() {
  try {
    const connector = yield call(dhtConnector.init, {
      publishers: [
        '35.171.116.3:8500',
        '127.0.0.1:8500',
        '127.0.0.1:5000'
      ]
    });

    yield put({ type: 'DHT_CONNECT_SUCCEEDED', connector });
  } catch (e) {
    console.log('ERROR ', e);
    yield put({ type: 'DHT_CONNECT_FAILED', error: e.message });
  }
}

export function* getPeersFor({ payload: { searchTerm, category } }) {
  const keywords = [...(searchTerm.split(' ')), category];
  try {
    const responses = yield Promise.all(keywords.map(keyword => dhtConnector.findPeersFor(keyword)));
    const peers = responses.reduce(
      (prev, curr) => [...prev, ...(curr.peers ? curr.peers : [])],
      []
    );
    yield put({ type: 'DHT_FETCH_PEERS_SUCCEEDED', peers });
  } catch (e) {
    console.log('ERROR ', e);
    yield put({ type: 'DHT_FETCH_PEERS_FAILED', error: e.message });
  }
}
