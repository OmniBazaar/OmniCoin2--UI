import { URL, URLSearchParams } from 'url';
import { wrapRequest } from '../../utils';
import ethers from 'ethers';
import config from '../../../config/config';

var Wallet = ethers.Wallet;
const isProd = () => true;//process.env.NODE_ENV === 'production';
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

const makeEthereumPayment = async function (privateKey, to, amount) {
  var provider = null;

  if (isProd()) {
    provider = ethers.providers.getDefaultProvider();
  } else {
    provider = ethers.providers.getDefaultProvider('ropsten');
  }

  await validateEthereumAddress(to)
  var wallet = new Wallet(privateKey, provider);
  var amount = ethers.utils.parseEther(amount + ''); //accept string only
  const d = (new Date()).getTime();
  const data = d.toString(16);
  return wallet.sendTransaction({
    to: to,
    value: amount,
    data: '0x0' + data.substr(-4)
  });
  // return await wallet.send(to, amount);
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
const validateEthereumAddress = async function (address) {
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

let infuraProvider = null;
const infuraApiKey = '207b7351ef4e4d279acd671ed906a243';
const getEthTransaction = (txHash) => {
  if (!infuraProvider) {
    infuraProvider = new ethers.providers.InfuraProvider(null, infuraApiKey);
  }

  return infuraProvider.getTransaction(txHash);
}

const calculateEthTransactionFee = (transaction) => {
  const gasPriceWei = ethers.utils.bigNumberify(transaction.gasPrice);
  const gasUsed = ethers.utils.bigNumberify(transaction.gasUsed);
  const fee = gasPriceWei.mul(gasUsed);
  return ethers.utils.formatEther(fee);
}

const getEthFee = async (privateKey, to, amount) => {
  const provider = ethers.providers.getDefaultProvider();
  const wallet = new Wallet(privateKey, provider);
  const gasLimit = wallet.defaultGasLimit;
  const gasPrice = await provider.getGasPrice();

  const d = (new Date()).getTime();
  const data = d.toString(16);
  const tx = {
    to,
    value: ethers.utils.parseEther(amount + ''),
    data: '0x0' + data.substr(-4)
  }
  const estimateGas = await wallet.estimateGas(tx);

  const maxFee = ethers.utils.bigNumberify(gasLimit).mul(gasPrice);
  const estimateFee = estimateGas.mul(gasPrice);
  return {
    maxFee: ethers.utils.formatEther(maxFee),
    estimateFee: ethers.utils.formatEther(estimateFee)
  };
}

export {
  createEthereumWallet,
  getEthereumWallets,
  makeEthereumPayment,
  getEthereumBalance,
  addEthereumAddress,
  getEthereumAddress,
  getEthereumTransactions,
  validateEthereumAddress,
  getEthTransaction,
  getEthFee,
  calculateEthTransactionFee
};
