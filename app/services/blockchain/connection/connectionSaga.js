import {
    put,
    takeEvery,
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
    {name: "Scopic Node", url: "ws://35.171.116.3:8090"},
   // {name: "Munich Node", url: "wss://eu.openledger.info/ws"}
];

export function createConnection(node) {
    let urls = nodes.map(node => node.url);
    let connectionManager = new Manager({url: node.url, urls});
    return connectionManager.connectWithFallback(true).then((res) => {
        return Apis.instance();
    });
}

export function* subscriber() {
    yield takeEvery(
        'CONNECT',
        connectToNode
    );
}

export function* connectToNode(action) {
   try {
       let result = yield call(createConnection, action.payload.node || nodes[0]);
       yield put({type: 'CONNECT_SUCCEEDED', apiInstance: result})
   } catch(e) {
        yield put({type: 'CONNECT_FAILED', error: e.message});
   }
}
