import { URL, URLSearchParams } from 'url';
import { wrapRequest } from '../../utils';

const apiKey = '4ad8f029-035c-4d68-8020-6f2fad9bfb7a';
const address = 'http://localhost:3001';
const feePerByte = 10; //satoshi

const createEthereumWallet = wrapRequest(async (password, label, email) => {
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

const getEthereumWallets = wrapRequest(async (password, guid) => fetch(`${address}/merchant/${guid}/accounts?password=${password}`));

const makeEthereumPayment = wrapRequest(async (guid, password, to, amount, from) => (
  fetch(`${address}/merchant/${guid}/payment?password=${password}&to=${to}&amount=${amount}&from=${from}&fee_per_byte=${feePerByte}`)
));

const getEthereumBalance = wrapRequest(async (address, guid, password) => fetch(`${address}/merchant/${guid}/balance?password=${password}`));

const addEthereumAddress = wrapRequest(async (password, guid, label) => fetch(`${address}/merchant/${guid}/accounts/create?password=${password}&label=${label}`));

const getEthereumAddress = wrapRequest(async (xpub, guid, password) => fetch(`${address}/merchant/${guid}/accounts/${xpub}?password=${password}`));

export {
  createEthereumWallet,
  getEthereumWallets,
  makeEthereumPayment,
  getEthereumBalance,
  addEthereumAddress,
  getEthereumAddress
};
