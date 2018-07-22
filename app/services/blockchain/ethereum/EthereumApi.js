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
// function (address) {
//   var networks = ethers.networks;
//   var providers = ethers.providers;
//   var provider = providers.getDefaultProvider('ropsten', "TFJCBHDJ5U51N2RDKVZU5BMMJ4YEXYESNQ");
  
//   // Connect to Etherscan
//   // var network = providers.networks.ropsten;
//   // var etherscanProvider = new providers.EtherscanProvider(network);
   
//   provider.getHistory(address).then(function (result) {
//     console.log("result: " + result);
//     return result;
//   });
// };

export {
  createEthereumWallet,
  getEthereumWallets,
  makeEthereumPayment,
  getEthereumBalance,
  addEthereumAddress,
  getEthereumAddress,
  getEthereumTransactions
};
