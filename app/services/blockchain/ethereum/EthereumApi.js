import { URL, URLSearchParams } from 'url';
import { wrapRequest } from '../../utils';
import ethers from 'ethers';

// var ethers = require('ethers');
// var Wallet = ethers.Wallet;

const apiKey = '4ad8f029-035c-4d68-8020-6f2fad9bfb7a';
const address = 'http://localhost:3001';
const feePerByte = 10; //satoshi
var Wallet = ethers.Wallet;
Wallet.provider = ethers.providers.getDefaultProvider('ropsten');

const createEthereumWallet = function (privateKey, label, email) {
  var wallet = Wallet.createRandom();
  return wallet;
};

const getEthereumWallets = function (privateKey) {
  var wallet = new Wallet(privateKey);
  return wallet;
};

const getEthereumBalance = function (privateKey) {
  var wallet = new Wallet(privateKey);
  var balancePromise = wallet.getBalance();

  balancePromise.then(function (balance) {
    return balance;
  });
  
};

const makeEthereumPayment = wrapRequest(async (address, privateKey, to, amount, from) => (
  fetch(`${address}/merchant/${address}/payment?password=${privateKey}&to=${to}&amount=${amount}&from=${from}&fee_per_byte=${feePerByte}`)
));

const addEthereumAddress = wrapRequest(async (privateKey, address, label) => fetch(`${address}/merchant/${address}/accounts/create?password=${privateKey}&label=${label}`));

const getEthereumAddress = wrapRequest(async (xpub, address, privateKey) => fetch(`${address}/merchant/${address}/accounts/${xpub}?password=${privateKey}`));

export {
  createEthereumWallet,
  getEthereumWallets,
  makeEthereumPayment,
  getEthereumBalance,
  addEthereumAddress,
  getEthereumAddress
};
