import { createActions } from 'redux-actions';

const {
  submitTransfer,
  createEscrowTransaction
} = createActions({
  SUBMIT_TRANSFER: (data) => ({ data }),
  CREATE_ESCROW_TRANSACTION: (expirationTime, buyer, seller, escrow, amount, transferToEscrow) => ({
    expirationTime, buyer, seller, escrow, amount, transferToEscrow
  }),
});

export {
  submitTransfer,
  createEscrowTransaction
};
