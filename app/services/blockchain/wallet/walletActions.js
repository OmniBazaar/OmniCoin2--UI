import { createActions } from 'redux-actions';

const {
  getAccountBalance
} = createActions({
  GET_ACCOUNT_BALANCE: (account) => ({ account })
});

export { getAccountBalance };
