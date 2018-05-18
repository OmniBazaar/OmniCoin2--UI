import { call, put, takeEvery } from 'redux-saga/effects';
import DHTConnector from '../../../utils/dht-connector';

const dhtConnector = new DHTConnector();

export function* dhtSubscriber() {
  yield takeEvery('DHT_CONNECT', connect);
  yield takeEvery('DHT_GET_PEERS_FOR', getPeersFor);
  yield takeEvery('DHT_FETCH_PEERS_DATA', fetchPeersData);
}

export function* connect() {
  try {
    const connector = yield call(dhtConnector.init, {});

    yield put({ type: 'DHT_CONNECT_SUCCEEDED', connector });
  } catch (e) {
    yield put({ type: 'DHT_CONNECT_FAILED', error: e.message });
  }
}

export function* getPeersFor({ payload }) {
  try {
    const { peers, noPeers } = yield call(dhtConnector.findPeersFor.bind(dhtConnector), payload);
    const finalPeers = noPeers ? [] : peers;

    yield put({ type: 'DHT_FETCH_PEERS_DATA', fetchResult: { peers: finalPeers, keyword: payload } });
  } catch (e) {
    yield put({ type: 'DHT_FETCH_PEERS_FAILED', error: e.message });
  }
}

export function* fetchPeersData({ fetchResult: { peers, keyword } }) {
  console.log('fetching peers data', peers);
  try {
    // TODO fetch all peers data here
    yield put({ type: 'DHT_SEARCH_SUCCEEDED', searchResult: { keyword, data: [] } });
  } catch (e) {
    yield put({ type: 'DHT_SEARCH_FAILED', error: e.message });
  }
}
