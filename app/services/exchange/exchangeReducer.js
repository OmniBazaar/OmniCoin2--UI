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
  exchangeMakeSaleSuccess,
  getBtcTransactionFee,
  getBtcTransactionFeeFinished,
  resetTransactionFees,
  getEthTransactionFee,
  getEthTransactionFeeFinished
} from "./exchangeActions";

const defaultState = {
  loading: false,
  error: null,
  txid: null,
  sale: {},
  requestingSale: false,
  requestSaleError: null,
  inProgressPhase: null,
  waitingPhase: null,
  calculateBtcFeeId: null,
  gettingBtcFee: false,
  btcFee: 0,
  getBtcFeeError: null,
  calculateEthFeeId: null,
  gettingEthFee: false,
  ethEstimateFee: 0,
  ethMaxFee: 0,
  getEthFeeError: null
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
      sale: {},
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
  },
  [getBtcTransactionFee](state, { payload: { id } }) {
    return {
      ...state,
      calculateBtcFeeId: id,
      gettingBtcFee: true,
      getBtcFeeError: null
    };
  },
  [getBtcTransactionFeeFinished](state, { payload: { id, error, fee } }) {
    if (id !== state.calculateBtcFeeId) {
      return state;
    }

    return {
      ...state,
      calculateBtcFeeId: null,
      gettingBtcFee: false,
      getBtcFeeError: error,
      btcFee: error ? 0 : fee
    };
  },
  [resetTransactionFees](state) {
    return {
      ...state,
      calculateBtcFeeId: null,
      gettingBtcFee: false,
      getBtcFeeError: null,
      btcFee: 0,
      calculateEthFeeId: null,
      gettingEthFee: false,
      getEthFeeError: null,
      ethMaxFee: 0,
      ethEstimateFee: 0
    };
  },
  [getEthTransactionFee](state, { payload: { id } }) {
    return {
      ...state,
      calculateEthFeeId: id,
      gettingEthFee: true,
      getEthFeeError: null
    };
  },
  [getEthTransactionFeeFinished](state, { payload: { id, error, maxFee, estimateFee } }) {
    if (id !== state.calculateEthFeeId) {
      return state;
    }

    return {
      ...state,
      calculateEthFeeId: null,
      gettingEthFee: false,
      getEthFeeError: error,
      ethMaxFee: error ? 0 : maxFee,
      ethEstimateFee: error ? 0 : estimateFee
    };
  },
}, defaultState);

export default reducer;
