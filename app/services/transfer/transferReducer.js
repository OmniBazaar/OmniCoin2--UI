import { handleActions } from 'redux-actions';

import { submitTransfer } from './transferActions';

const defaultState = {
  from_name: '',
  to_name: '',
  amount: '',
  memo: '',
  error: null,
  feeAmount: 0,
  feeStatus: {},
  maxAmount: false,
  hidden: false,
  reputation: 5
};

const reducer = handleActions({
  [submitTransfer](state, { payload: { data } }) {
    return {
      ...state,
      ...data,
      loading: true,
      error: null
    };
  },
  SUBMIT_TRANSFER_SUCCEEDED: (state) => ({
    ...state,
    loading: false,
    error: null
  }),
  UPDATE_TRANSFER_FAILED: (state, { error }) => ({
    ...state,
    loading: false,
    error
  }),
}, defaultState);

export default reducer;
