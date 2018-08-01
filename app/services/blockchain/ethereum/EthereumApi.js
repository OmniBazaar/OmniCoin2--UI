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
  var provider = null;

  if (isProd()) {
    provider = ethers.providers.getDefaultProvider();
  } else {
    provider = ethers.providers.getDefaultProvider('ropsten');
  }

  validateEthereumAddress(to)
  var wallet = new Wallet(privateKey, provider);
  var amount = ethers.utils.parseEther(amount);
  var sendPromise = wallet.send(to, amount);

  return sendPromise.then(function (transactionHash) {
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

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
const validateEthereumAddress = function (address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    throw "Invalid Ethereum Address";
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    // If it's all small caps or all all caps, return true
    return true;
  } else {
    // Otherwise check each case
    return true; //isChecksumAddress(address);
  }
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isChecksumAddress = function (address) {
  // Check each case
  // address = address.replace('0x', '');
  // var addressHash = sha3(address.toLowerCase());
  // for (var i = 0; i < 40; i++) {
  //   // the nth letter should be uppercase if the nth digit of casemap is 1
  //   if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
  //     throw "Invalid Ethereum Address";
  //   }
  // }
  return true;
};

export {
  createEthereumWallet,
  getEthereumWallets,
  makeEthereumPayment,
  getEthereumBalance,
  addEthereumAddress,
  getEthereumAddress,
  getEthereumTransactions,
  validateEthereumAddress
};
