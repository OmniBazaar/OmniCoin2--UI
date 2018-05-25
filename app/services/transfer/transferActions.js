import { createActions } from 'redux-actions';

const {
  submitTransfer,
  createEscrowTransaction,
  getCommonEscrows,
  setCurrency
} = createActions({
  SUBMIT_TRANSFER: (data) => ({ data }),
  CREATE_ESCROW_TRANSACTION: (expirationTime, buyer, seller, escrow, amount, transferToEscrow, memo) => ({
    expirationTime, buyer, seller, escrow, amount, transferToEscrow, memo
  }),
  GET_COMMON_ESCROWS: (fromAccount, toAccount) => ({ fromAccount, toAccount }),
  SET_CURRENCY: (transferCurrency) => ({ transferCurrency })
});

export {
  submitTransfer,
  createEscrowTransaction,
  getCommonEscrows,
  setCurrency
};
