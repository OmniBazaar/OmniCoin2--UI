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
  connectEthereumWalletFinish
} = createActions({
  CREATE_ETHEREUM_WALLET: (password, label, email) => ({ password, label, email }),
  GET_ETHEREUM_WALLETS: (guid, password) => ({ guid, password }),
  MAKE_ETHEREUM_PAYMENT: (guid, password, to, amount, from, fee) => ({
    guid, password, to, amount, from, fee
  }),
  GET_ETHEREUM_BALANCE: (guid, password, address) => ({ guid, password, address }),
  ADD_ETHEREUM_ADDRESS: (guid, password, label) => ({ guid, password, label }),
  TOGGLE_ETHEREUM_MODAL: () => ({ }),
  TOGGLE_ADD_ADDRESS_ETHEREUM_MODAL: () => ({ }),
  CONNECT_ETHEREUM_WALLET: (guid, password) => ({ guid, password }),
  CONNECT_ETHEREUM_WALLET_FINISH: (error) => ({ error })
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
  connectEthereumWalletFinish
};
