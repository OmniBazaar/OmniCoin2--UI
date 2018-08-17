import {
  Apis,
  Manager
} from 'omnibazaarjs-ws';
import { FetchChain, TransactionHelper, Aes } from 'omnibazaarjs/es';


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

async function createConnection(nodes) {
  const urls = nodes.map(item => item.url);
  const connectionManager = new Manager({ url: nodes[0].url, urls });
  const connectionStart = new Date().getTime();
  const {
    node: connectedNode,
    latency
  } = await connectionManager.connectWithFallback(true).then(() => {
    const { url } = Apis.instance();
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

function calcBlockTime(blockNumber, globalObject, dynGlobalObject) {
  if (!globalObject || !dynGlobalObject) return null;
  const blockInterval = globalObject.parameters.block_interval;
  const headBlock = dynGlobalObject.head_block_number;
  const headBlockTime = new Date(`${dynGlobalObject.time}Z`);
  const secondsBelow = (headBlock - blockNumber) * blockInterval;
  return new Date(headBlockTime - secondsBelow * 1000);
}

function memoObject(memo, fromAccount, toAccount, pKey) {
  const memoFromKey = fromAccount.getIn(['options', 'memo_key']);
  const memoToKey = toAccount.getIn(['options', 'memo_key']);
  const nonce = TransactionHelper.unique_nonce_uint64();

  return {
    from: memoFromKey,
    to: memoToKey,
    nonce,
    message: Aes.encrypt_with_checksum(
      pKey,
      memoToKey,
      nonce,
      memo
    )
  };
}

export {
  getDynGlobalObject,
  getGlobalObject,
  createConnection,
  calcBlockTime,
  fetchAccount,
  memoObject
};
