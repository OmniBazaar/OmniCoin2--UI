import {
  Apis,
  Manager
} from 'omnibazaarjs-ws';
import { FetchChain } from 'omnibazaarjs/es';

import { nodesAddresses as nodes } from '../settings';

async function getDynGlobalObject() {
  return (await Apis.instance().db_api().exec('get_objects', [['2.1.0']]))[0];
}

async function getGlobalObject() {
  return (await Apis.instance().db_api().exec('get_objects', [['2.0.0']]))[0];
}

async function fetchAccount(username) {
  const cachedAccount = await FetchChain('getAccount', username);
  return (await Apis.instance().db_api().exec('get_objects', [[cachedAccount.get('id')]]))[0];
}

async function createConnection(node) {
  const urls = nodes.map(item => item.url);
  const connectionManager = new Manager({ url: node.url, urls });
  const connectionStart = new Date().getTime();
  const {
    node: connectedNode,
    latency
  } = await connectionManager.connectWithFallback(true).then(() => {
    const url = Apis.instance().url;
    return {
      node: nodes.find(item => item.url === url),
      latency: new Date().getTime() - connectionStart
    };
  });
  return {
    node: connectedNode,
    latency,
  };
}

function calcBlockTime(block_number, globalObject, dynGlobalObject) {
  if (!globalObject || !dynGlobalObject) return null;
  const block_interval = globalObject.parameters.block_interval;
  const head_block = dynGlobalObject.head_block_number;
  const head_block_time = new Date(`${dynGlobalObject.time}Z`);
  const seconds_below = (head_block - block_number) * block_interval;
  return new Date(head_block_time - seconds_below * 1000);
}

export {
  getDynGlobalObject,
  getGlobalObject,
  createConnection,
  calcBlockTime,
  fetchAccount
};
