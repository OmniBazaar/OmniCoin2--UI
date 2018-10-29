import { handleActions } from 'redux-actions';

import {
  exchangeBtc,
  exchangeBtcSucceeded,
  exchangeBtcFailed,
  exchangeEth,
  exchangeEthFailed,
  exchangeEthSucceeded,
  exchangeRequestRates,
  exchangeRequestRatesFinished
} from "./exchangeActions";

const defaultState = {
  loading: false,
  error: null,
  txid: null,
  requestingRates: false,
  rates: null
};

const reducer = handleActions({
  [exchangeBtc](state) {
    return {
      ...state,
      loading: true,
      error: null
    }
  },
  [exchangeBtcSucceeded](state, { payload: { txid }}) {
    return {
      ...state,
      loading: false,
      error: null,
      txid
    }
  },
  [exchangeBtcFailed](state, { payload: { error } }) {
    return  {
      ...state,
      loading: false,
      error
    }
  },
  [exchangeEth](state) {
    return {
      ...state,
      loading: true,
      error: null
    }
  },
  [exchangeEthSucceeded](state, { payload: { txid }}) {
    return {
      ...state,
      loading: false,
      error: null,
      txid
    }
  },
  [exchangeEthFailed](state, { payload: { error } }) {
    return  {
      ...state,
      loading: false,
      error
    }
  },
  [exchangeRequestRates](state) {
    return {
      ...state,
      requestingRates: true,
      rates: null
    };
  },
  [exchangeRequestRatesFinished](state, { payload: { error, rates } }) {
    return {
      ...state,
      requestingRates: false,
      error,
      rates
    };
  }
}, defaultState);

export default reducer;
