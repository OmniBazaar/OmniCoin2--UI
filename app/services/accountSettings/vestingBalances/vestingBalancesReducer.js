import { handleActions } from 'redux-actions';

import {
  getVestingBalances,
  getVestingBalancesFailed,
  getVestingBalancesSucceeded,
  claim,
  claimSucceeded,
  claimFailed
} from "./vestingBalancesActions";

const defaultState = {
  vestingBalances: [],
  error: null,
  loading: false,
  claim: {
    vestingBalance: null,
    forceAll: false,
    error: null,
    loading: false
  }
};

const reducer = handleActions({
  [getVestingBalances](state) {
    return {
      ...state,
      error: null,
      loading: true
    }
  },
  [getVestingBalancesSucceeded](state, { payload: { vestingBalances } }) {
    return {
      ...state,
      vestingBalances,
      loading: false
    }
  },
  [getVestingBalancesFailed](state, { payload: { error } }) {
    return  {
      ...state,
      error,
      loading: false
    }
  },
  [claim](state, { payload: { vestingBalance, forceAll } }) {
    return {
      ...state,
      claim: {
        vestingBalance,
        forceAll,
        error: null,
        loading: true
      }
    }
  },
  [claimSucceeded](state) {
    return {
      ...state,
      claim:  {
        ...defaultState.claim
      }
    }
  },
  [claimFailed](state, { payload: { error } }) {
    return {
      ...state,
      claim: {
        ...state.claim,
        error,
        loading: false
      }
    }
  }
}, defaultState);

export default reducer;
