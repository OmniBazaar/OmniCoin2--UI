import { URL, URLSearchParams } from 'url';
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

const getBalance = wrapRequest(async (address, guid, password) => fetch(`${address}/merchant/${guid}/balance?password=${password}`));

const addAddress = wrapRequest(async (password, guid, label) => fetch(`${address}/merchant/${guid}/accounts/create?password=${password}&label=${label}`));

const getAddress = wrapRequest(async (xpub, guid, password) => fetch(`${address}/merchant/${guid}/accounts/${xpub}?password=${password}`));

const validateAddress = wrapRequest(async (address) => fetch(`${blockInfoAddress}/address/${address}?format=json&offset=0`));

const getHistory = wrapRequest(async (addresses, n, offset) => {
  const active = addresses.reduce((accumulated, val) => accumulated + '|' + val.extendedPublicKey, '');
  return fetch(`${blockInfoAddress}/multiaddr?active=${active}&format=json&n=${n}&offset=${offset}`)
});

export {
  createWallet,
  getWallets,
  makePayment,
  getBalance,
  addAddress,
  getAddress,
  validateAddress,
  getHistory
};
