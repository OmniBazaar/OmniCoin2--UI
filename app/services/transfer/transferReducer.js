import { handleActions } from 'redux-actions';

import {
  submitTransfer,
  createEscrowTransaction,
  getCommonEscrows
} from './transferActions';

const defaultState = {
  from_name: '',
  toName: '',
  amount: '',
  memo: '',
  error: null,
  feeAmount: 0,
  feeStatus: {},
  maxAmount: false,
  hidden: false,
  reputation: 5,
  loading: false,
  gettingCommonEscrows: false,
  commonEscrows: []
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
  SUBMIT_TRANSFER_FAILED: (state, { error }) => ({
    ...state,
    loading: false,
    error
  }),
  [createEscrowTransaction](state) {
    return {
      ...state,
      loading: true,
      error: null
    };
  },
  CREATE_ESCROW_TRANSACTION_SUCCEEDED: (state) => ({
    ...state,
    loading: false
  }),
  CREATE_ESCROW_TRANSACTION_FAILED: (state, { error }) => ({
    ...state,
    loading: false,
    error
  }),
  [getCommonEscrows](state) {
    return {
      ...state,
      gettingCommonEscrows: true,
      error: null,
      commonEscrows: []
    }
  },
  GET_COMMON_ESCROWS_SUCCEEDED: (state, { commonEscrows }) => {
    return {
      ...state,
      gettingCommonEscrows: false,
      error: null,
      commonEscrows
    }
  },
  GET_COMMON_ESCROWS_FAILED: (state, { error }) => {
    return {
      ...state,
      gettingCommonEscrows: false,
      error
    }
  }
}, defaultState);

export default reducer;
