import { createActions } from 'redux-actions';

const {
  createWallet,
  getWallets,
  makePayment,
  getBalance,
} = createActions({
  CREATE_WALLET: (password, privKey, label, email) => ({ password, privKey, label, email }),
  GET_WALLETS: (password) => ({ password }),
  MAKE_PAYMENT: (password, to, amount, from, fee) => ({ password, to, amount, from, fee }),
  GET_BALANCE: (password, address) => ({ password, address })
});

export {
  createWallet,
  getWallets,
  makePayment,
  getBalance
}
