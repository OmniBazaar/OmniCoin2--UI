import { createActions } from 'redux-actions';

const {
  createEthereumWallet,
  getEthereumWallets,
  makeEthereumPayment,
  getEthereumBalance,
  addEthereumAddress,
  toggleEthereumModal,
  toggleAddAddressEthereumModal,
  connectEthereumWallet,
  connectEthereumWalletFinish,
  getEthereumTransactions
} = createActions({
  CREATE_ETHEREUM_WALLET: (privateKey, label, email) => ({ privateKey, label, email }),
  GET_ETHEREUM_WALLETS: (address, privateKey) => ({ address, privateKey }),
  MAKE_ETHEREUM_PAYMENT: (address, privateKey, to, amount, from, fee) => ({
    address, privateKey, to, amount, from, fee
  }),
  GET_ETHEREUM_BALANCE: (address, privateKey, silient) => ({ address, privateKey, silient }),
  ADD_ETHEREUM_ADDRESS: (address, privateKey, label) => ({ address, privateKey, label }),
  TOGGLE_ETHEREUM_MODAL: () => ({ }),
  TOGGLE_ADD_ADDRESS_ETHEREUM_MODAL: () => ({ }),
  CONNECT_ETHEREUM_WALLET: (walletPrivateKey, walletBrainKey) => ({ walletPrivateKey, walletBrainKey }),
  CONNECT_ETHEREUM_WALLET_FINISH: (error) => ({ error }),
  GET_ETHEREUM_TRANSACTIONS: (address) => ({ address })
});

export {
  createEthereumWallet,
  getEthereumWallets,
  makeEthereumPayment,
  getEthereumBalance,
  addEthereumAddress,
  toggleEthereumModal,
  toggleAddAddressEthereumModal,
  connectEthereumWallet,
  connectEthereumWalletFinish,
  getEthereumTransactions
};
