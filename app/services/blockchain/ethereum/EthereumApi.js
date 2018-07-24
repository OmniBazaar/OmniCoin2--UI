import { URL, URLSearchParams } from 'url';
import { wrapRequest } from '../../utils';
import ethers from 'ethers';

var Wallet = ethers.Wallet;
const isProd = () => process.env.NODE_ENV === 'production';
const ApiAddress = isProd() ? 'http://api.etherscan.io/api' : 'http://api-ropsten.etherscan.io/api';
const ApiKey = '76ST8GSF68S6Q9TY1EMQ6ZQKZXMZ9N6HJ1';

const createEthereumWallet = function () {
  if (isProd()) {
    Wallet.provider = ethers.providers.getDefaultProvider();
  } else {
    Wallet.provider = ethers.providers.getDefaultProvider('ropsten');
  }
  var wallet = Wallet.createRandom();
  return wallet;
};

const getEthereumWallets = function (privateKey, brainKey) {
  if (isProd()) {
    Wallet.provider = ethers.providers.getDefaultProvider();
  } else {
    Wallet.provider = ethers.providers.getDefaultProvider('ropsten');
  }

  if (brainKey) {
    var wallet = new Wallet.fromMnemonic(brainKey);
    return wallet;
  } else {
    var wallet = new Wallet(privateKey);
    return wallet;
  }
};

const getEthereumBalance = function (privateKey) {
  var provider = null;

  if (isProd()) {
    provider = ethers.providers.getDefaultProvider();
  } else {
    provider = ethers.providers.getDefaultProvider('ropsten');
  }

  var wallet = new ethers.Wallet(privateKey, provider);

  var balancePromise = wallet.getBalance();

  return balancePromise.then(function (balance) {
    console.log(balance);
    return ethers.utils.formatEther(balance);
  });
};

const makeEthereumPayment = function (privateKey, to, amount) {
  if (isProd()) {
    Wallet.provider = ethers.providers.getDefaultProvider();
  } else {
    Wallet.provider = ethers.providers.getDefaultProvider('ropsten');
  }

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


const getEthereumTransactions = wrapRequest(async (address) => fetch(`${ApiAddress}?module=account&action=txlist&startblock=0&endblock=latest&sort=asc&address=${address}&apikey=${ApiKey}`));

export {
  createEthereumWallet,
  getEthereumWallets,
  makeEthereumPayment,
  getEthereumBalance,
  addEthereumAddress,
  getEthereumAddress,
  getEthereumTransactions
};
