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

const sleep = (duration) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
}

const reconnectInterval = 3000; //ms
const reconnect = async (nodes) => {
  console.log('NODE: retry connect...');
  await closeNodeSocket();
  await sleep(reconnectInterval);
  return await createConnection(nodes, true);
}

let lastApiInstance = null;
let originWSOnclose = null;

const closeNodeSocket = async () => {
  if (lastApiInstance) {
    lastApiInstance.ws_rpc.ws.onclose = originWSOnclose;
  }
  await Apis.close();
  lastApiInstance = null;
}

let hasForceConnect = false;
async function createConnection(nodes, isReconnectOnClosed) {
  if (!isReconnectOnClosed) {
    hasForceConnect = true;
  }
  while (true) {
    if (isReconnectOnClosed && hasForceConnect) {
      return null;
    }

    try {
      await closeNodeSocket();
      
      const urls = nodes.map(item => item.url);
      const connectionManager = new Manager({ url: nodes[0].url, urls });
      const connectionStart = new Date().getTime();

      await connectionManager.connectWithFallback(true);
      const apiInstance = Apis.instance();
      lastApiInstance = apiInstance;
      const ws = apiInstance.ws_rpc.ws;
      originWSOnclose = ws.onclose;
      ws.onclose = (e) => {
        console.log('on node socket error');
        if (e.code !== 1000) {
          console.log('Node unexpected close', e);
          reconnect(nodes);
        }
        originWSOnclose(e);
      };
      const { url } = apiInstance;

      if (!isReconnectOnClosed) {
        hasForceConnect = false;
      }

      return {
        node: nodes.find(item => item.url === url),
        latency: new Date().getTime() - connectionStart
      };
    } catch (err) {
      console.log('Create connect error:', err);
      console.log('NODE: retry connect...');
      await closeNodeSocket();
      await sleep(reconnectInterval);
    }
  }
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
