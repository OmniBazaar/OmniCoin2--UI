import { createActions } from 'redux-actions';

const {
  submitTransfer,
  createEscrowTransaction,
  getCommonEscrows
} = createActions({
  SUBMIT_TRANSFER: (data) => ({ data }),
  CREATE_ESCROW_TRANSACTION: (expirationTime, buyer, seller, escrow, amount, transferToEscrow) => ({
    expirationTime, buyer, seller, escrow, amount, transferToEscrow
  }),
  GET_COMMON_ESCROWS: (fromAccount, toAccount) => ({ fromAccount, toAccount })
});

export {
  submitTransfer,
  createEscrowTransaction,
  getCommonEscrows
};
