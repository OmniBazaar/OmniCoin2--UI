import {
  Apis,
  Manager
} from 'omnibazaarjs-ws';

import { nodesAddresses as nodes } from '../settings';

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

export {
  dynGlobalObject,
  createConnection
};
