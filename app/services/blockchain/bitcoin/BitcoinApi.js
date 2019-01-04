import { URL, URLSearchParams } from 'url';
import bitcoinTransaction from 'bitcoin-transaction';
import request from 'request-promise-native';
import { wrapRequest } from '../../utils';

const apiKey = '4ad8f029-035c-4d68-8020-6f2fad9bfb7a';
const address = 'http://localhost:3000';
const blockInfoAddress = 'https://blockchain.info';

const feePerByte = 10; // satoshi

const createWallet = wrapRequest(async (password, label, email) => {
  const createUrl = new URL(`${address}/api/v2/create`);
  createUrl.search = new URLSearchParams({
    api_code: apiKey,
    password,
    label,
    email,
    hd: true
  });
  return fetch(createUrl);
});

const getWallets = wrapRequest(async (password, guid) => fetch(`${address}/merchant/${guid}/accounts?password=${password}`));

const makePayment = wrapRequest(async (guid, password, to, amount, from) => (
  fetch(`${address}/merchant/${guid}/payment?password=${password}&to=${to}&amount=${amount}&from=${from}&fee_per_byte=${feePerByte}`)
));

const sendToMany = wrapRequest(async (guid, password, recipients, from) => (
  fetch(`${address}/merchant/${guid}/sendmany?password=${password}&recipients=${encodeURIComponent(JSON.stringify(recipients))}&from=${from}&fee_per_byte=${feePerByte}`)
));

const getBalance = wrapRequest(async (address, guid, password) => fetch(`${address}/merchant/${guid}/balance?password=${password}`));

const addAddress = wrapRequest(async (password, guid, label) => fetch(`${address}/merchant/${guid}/accounts/create?password=${password}&label=${label}`));

const getAddress = wrapRequest(async (xpub, guid, password) => fetch(`${address}/merchant/${guid}/accounts/${xpub}?password=${password}`));

const validateAddress = wrapRequest(async (address) => fetch(`${blockInfoAddress}/address/${address}?format=json&offset=0`));

const getHistory = wrapRequest(async (addresses, n, offset) => {
  const active = addresses.reduce((accumulated, val) => accumulated + '|' + val.extendedPublicKey, '');
  return fetch(`${blockInfoAddress}/multiaddr?active=${active}&format=json&n=${n}&offset=${offset}`)
});

const sendTransaction = async (from, to, privateKeyWIF, amount) => {
  return bitcoinTransaction.sendTransaction({
    from: from,
    to: to,
    privKeyWIF: privateKeyWIF,
    btc: amount,
    fee: feePerByte
  });
}

const getTotalFee = wrapRequest(async (guid, password, to, amount, from) => (
  fetch(`${address}/merchant/${guid}/payment-fee?password=${password}&to=${to}&amount=${amount}&from=${from}&fee_per_byte=${feePerByte}`)
));

const getBtcTransaction = async (txId) => {
  const uri = `${blockInfoAddress}/tx/${txId}?format=json`;
  return await request({
    uri,
    method: 'GET',
    json: true
  });
}

const getBtcTransactionFee = async (txId) => {
  try {
    const transaction = await getBtcTransaction(txId);
    if (!transaction) {
      return 0;
    }
    let totalInput = 0;
    transaction.inputs.forEach(inp => {
      totalInput += parseFloat(inp.prev_out.value);
    });

    let totalOutput = 0;
    transaction.out.forEach(out => {
      totalOutput += parseFloat(out.value);
    });

    let fee = totalInput - totalOutput;
    if (fee < 0) fee = 0;

    return fee / Math.pow(10, 8);
  } catch (err) {
    console.log('BTC transaction fee error', err);
    return 0;
  }
}

export {
  createWallet,
  getWallets,
  makePayment,
  getBalance,
  addAddress,
  getAddress,
  validateAddress,
  getHistory,
  sendToMany,
  sendTransaction,
  getTotalFee,
  getBtcTransactionFee
};
