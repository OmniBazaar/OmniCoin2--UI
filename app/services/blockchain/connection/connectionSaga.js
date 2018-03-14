import {
  put,
  takeEvery,
  takeLatest,
  call
} from 'redux-saga/effects';
import {
    Apis,
    Manager
} from "omnibazaarjs-ws";

export const nodes = [
  // {name: "Bitshares Node", url: "wss://japan.bitshares.apasia.tech/ws"},
  // {name: "Local", url: "wss://kc-us-dex.xeldal.com/ws"},
  // {name: "Netherlands", url: "wss://dex.rnglab.org"},
  { name: 'Scopic Node', url: 'ws://35.171.116.3:8090' },
  // {name: "Munich Node", url: "wss://eu.openledger.info/ws"}
];

async function dynGlobalObject() {
  return (await Apis.instance().db_api().exec('get_objects', [['2.1.0']]))[0];
}

async function createConnection(node) {
  const urls = nodes.map(node => node.url);
  const connectionManager = new Manager({ url: node.url, urls });
  const connectionStart = new Date().getTime();
  const { node: connectedNode, latency } = await connectionManager.connectWithFallback(true).then(() => {
    const url = Apis.instance().url;
    return {
      node: nodes.find(node => node.url === url),
      latency: new Date().getTime() - connectionStart
    };
  });
  return {
    node: connectedNode,
    latency,
  };
}

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
    yield put({ type: 'CONNECT_SUCCEEDED', ...result });
  } catch (e) {
    yield put({ type: 'CONNECT_FAILED', error: e.message });
  }
}

export function* getDynGlobalObject() {
  try {
    const result = yield call(dynGlobalObject);
    yield put({ type: 'DYN_GLOBAL_OBJECT_SUCCEEDED', dynGlobalObject: result });
  } catch (e) {
    yield put({ type: 'DYN_GLOBAL_OBJECT_FAILED', error: e.message });
  }
}
