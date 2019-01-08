import { createActions } from 'redux-actions';

const {
  createWallet,
  getWallets,
  makePayment,
  getBalance,
  addAddress,
  toggleModal,
  toggleAddAddressModal,
  connectWallet,
  connectWalletFinish,
  getBitcoinBalance,
  getBitcoinBalanceFinished
} = createActions({
  CREATE_WALLET: (password, label, email) => ({ password, label, email }),
  GET_WALLETS: (guid, password) => ({ guid, password }),
  MAKE_PAYMENT: (guid, password, to, amount, from, fee) => ({
    guid, password, to, amount, from, fee
  }),
  GET_BALANCE: (guid, password, address) => ({ guid, password, address }),
  ADD_ADDRESS: (guid, password, label) => ({ guid, password, label }),
  TOGGLE_MODAL: () => ({ }),
  TOGGLE_ADD_ADDRESS_MODAL: () => ({ }),
  CONNECT_WALLET: (guid, password) => ({ guid, password }),
  CONNECT_WALLET_FINISH: (error) => ({ error }),
  GET_BITCOIN_BALANCE: (guid, password) => ({ guid, password }),
  GET_BITCOIN_BALANCE_FINISHED: (balance) => ({ balance })
});

export {
  createWallet,
  getWallets,
  makePayment,
  getBalance,
  addAddress,
  toggleModal,
  toggleAddAddressModal,
  connectWallet,
  connectWalletFinish,
  getBitcoinBalance,
  getBitcoinBalanceFinished
};
