import { URL, URLSearchParams } from 'url';
import { wrapRequest } from '../../utils';
import ethers from 'ethers';

var Wallet = ethers.Wallet;
// remove this on production.
Wallet.provider = ethers.providers.getDefaultProvider('ropsten');

const createEthereumWallet = function (privateKey) {
  if (privateKey) {
    var wallet = new Wallet(privateKey);
    return wallet;
  } else {
    var wallet = Wallet.createRandom();
    return wallet;
  }
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

const makeEthereumPayment = function (privateKey, to, amount) {
  var wallet = new Wallet(privateKey);
  var amount = ethers.utils.parseEther(amount);
  var sendPromise = wallet.send(to, amount);

  sendPromise.then(function (transactionHash) {
    console.log(transactionHash);
    return transactionHash;
  });
};

const addEthereumAddress = function (privateKey, address, label) {
  //todo
  var wallet = new Wallet(privateKey);
  var balancePromise = wallet.getBalance();

  balancePromise.then(function (balance) {
    return balance;
  });

};

const getEthereumAddress = function (xpub, address, privateKey) {
  //todo
  var wallet = new Wallet(privateKey);
  var balancePromise = wallet.getBalance();

  balancePromise.then(function (balance) {
    return balance;
  });
};

export {
  createEthereumWallet,
  getEthereumWallets,
  makeEthereumPayment,
  getEthereumBalance,
  addEthereumAddress,
  getEthereumAddress
};
