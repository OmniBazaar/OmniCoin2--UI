import { handleActions } from 'redux-actions';

import { getAccountBalance } from './walletActions';

const defaultState = {
  balance: null,
  loading: false,
  error: null
};

const reducer = handleActions({
  [getAccountBalance](state, { payload: { account } }) {
    return {
      ...state,
      loading: true,
    };
  },
  GET_ACCOUNT_BALANCE_SUCCEEDED: (state, { result }) => ({
    ...state,
    balance: result,
    loading: false,
    error: null
  }),
  GET_ACCOUNT_BALANCE_FAILED: (state, { error }) => ({
    ...state,
    balance: null,
    loading: false,
    error
  })
}, defaultState);

export default reducer;
