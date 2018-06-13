import { createActions } from 'redux-actions';

const {
  submitTransfer,
  createEscrowTransaction,
  getCommonEscrows,
  setCurrency,
  saleBonus
} = createActions({
  SUBMIT_TRANSFER: (data) => ({ data }),
  CREATE_ESCROW_TRANSACTION: (data) => ({ data }),
  GET_COMMON_ESCROWS: (from, to) => ({ from, to }),
  SET_CURRENCY: (transferCurrency) => ({ transferCurrency }),
  SALE_BONUS: (seller, buyer) => ({ seller, buyer })
});

export {
  submitTransfer,
  createEscrowTransaction,
  getCommonEscrows,
  setCurrency,
  saleBonus
};
