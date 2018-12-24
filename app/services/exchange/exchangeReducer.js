import { handleActions } from 'redux-actions';

import {
  exchangeBtc,
  exchangeBtcSucceeded,
  exchangeBtcFailed,
  exchangeEth,
  exchangeEthFailed,
  exchangeEthSucceeded,
  exchangeRequestSale,
  exchangeRequestSaleFinished,
  exchangeSetInProgressPhase,
  exchangeMakeSaleSuccess
} from "./exchangeActions";

const defaultState = {
  loading: false,
  error: null,
  txid: null,
  sale: {},
  requestingSale: false,
  requestSaleError: null,
  inProgressPhase: null,
  waitingPhase: null
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
  [exchangeRequestSale](state, { payload: { onlyRates } }) {
    if (onlyRates) {
      return state;
    }
    
    return {
      ...state,
      requestingSale: true,
      requestSaleError: null,
      inProgressPhase: null
    };
  },
  [exchangeRequestSaleFinished](state, { payload: { error, sale, onlyRates } }) {
    if (error) {
      return {
        ...state,
        requestingSale: false,
        requestSaleError: error,
      };
    }

    if (onlyRates) {
      const saleState = state.sale;
      saleState.rates = sale.rates;
      return {
        ...state,
        requestingSale: false,
        requestSaleError: error,
        sale: saleState
      };
    }

    return {
      ...state,
      requestingSale: false,
      requestSaleError: error,
      sale: sale && !error ? sale : state.sale
    };
  },
  [exchangeSetInProgressPhase](state, { payload: { inProgressPhase, waitingPhase } }) {
    return {
      ...state,
      inProgressPhase,
      waitingPhase
    };
  },
  [exchangeMakeSaleSuccess](state, { payload: { progress } }) {
    return {
      ...state,
      sale: {
        ...state.sale,
        progress
      }
    };
  }
}, defaultState);

export default reducer;
