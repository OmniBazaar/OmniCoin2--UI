import { URL, URLSearchParams } from 'url';
import { wrapRequest } from '../../utils';
import ethers from 'ethers';

var Wallet = ethers.Wallet;
// remove this on production.
Wallet.provider = ethers.providers.getDefaultProvider('ropsten');
const ApiAddress = 'http://api-ropsten.etherscan.io/api';

const createEthereumWallet = function () {
  var wallet = Wallet.createRandom();
  return wallet;
};

const getEthereumWallets = function (privateKey, brainKey) {
  if (brainKey) {
    var wallet = new Wallet.fromMnemonic(brainKey);
    return wallet;
  } else {
    var wallet = new Wallet(privateKey);
    return wallet;
  }
};

const getEthereumBalance = function (privateKey) {
  // var networks = ethers.networks;
  // var providers = ethers.providers;
  // wallet.provider = ethers.providers.getDefaultProvider();
  // wallet.provider = ethers.providers.networks.ropsten;

  var provider = ethers.providers.getDefaultProvider('ropsten');
  var wallet = new ethers.Wallet(privateKey, provider);

  var balancePromise = wallet.getBalance();

  return balancePromise.then(function (balance) {
    console.log(balance);
    return ethers.utils.formatEther(balance);
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
};

const getEthereumAddress = function (xpub, address, privateKey) {
  //todo
  var wallet = new Wallet(privateKey);
  var balancePromise = wallet.getBalance();

  balancePromise.then(function (balance) {
    return balance;
  });
};


const getEthereumTransactions = wrapRequest(async (address) => fetch(`${ApiAddress}?module=account&action=txlist&startblock=0&endblock=latest&sort=asc&address=${address}`));

export {
  createEthereumWallet,
  getEthereumWallets,
  makeEthereumPayment,
  getEthereumBalance,
  addEthereumAddress,
  getEthereumAddress,
  getEthereumTransactions
};
