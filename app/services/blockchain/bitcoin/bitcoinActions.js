import { createActions } from 'redux-actions';

const {
  createWallet,
  getWallets,
  makePayment,
  getBalance,
  addAddress,
  toggleModal,
  toggleAddAddressModal
} = createActions({
  CREATE_WALLET: (password, label, email) => ({ password, label, email }),
  GET_WALLETS: (guid, password) => ({ guid, password }),
  MAKE_PAYMENT: (guid, password, to, amount, from, fee) => ({
    guid, password, to, amount, from, fee
  }),
  GET_BALANCE: (guid, password, address) => ({ guid, password, address }),
  ADD_ADDRESS: (guid, password, label) => ({ guid, password, label }),
  TOGGLE_MODAL: () => ({ }),
  TOGGLE_ADD_ADDRESS_MODAL: () => ({ })
});

export {
  createWallet,
  getWallets,
  makePayment,
  getBalance,
  addAddress,
  toggleModal,
  toggleAddAddressModal
};
