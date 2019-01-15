import { handleActions } from 'redux-actions';

import {
  createEscrowTransaction,
  getCommonEscrows,
  setCurrency,
  omnicoinTransfer,
  omnicoinTransferSucceeded,
  omnicoinTransferFailed,
  bitcoinTransfer,
  bitcoinTransferSucceeded,
  bitcoinTransferFailed,
  ethereumTransfer,
  ethereumTransferSucceeded,
  ethereumTransferFailed,
  setBuyerAddress,
  loadDefaultShippingAddress,
  transferGetBtcTransactionFee,
  transferGetBtcTransactionFeeFinished,
  transferResetTransactionFees,
  transferGetEthTransactionFee,
  transferGetEthTransactionFeeFinished
} from './transferActions';

import { getStoredShippingAddress, storeShippingAddress } from './services'

const defaultState = {
  from_name: '',
  fromName: '',
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
  commonEscrows: [],
  transferCurrency: 'omnicoin',
  buyerAddress: null,
  defaultShippingAddress: {},
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
  [omnicoinTransfer](state) {
    return {
      ...state,
      loading: true,
      error: null
    };
  },
  [omnicoinTransferSucceeded](state) {
    return {
      ...state,
      loading: false,
    }
  },
  [omnicoinTransferFailed](state, { payload: { error } }) {
    return {
      ...state,
      loading: false,
      error
    }
  },
  [bitcoinTransfer](state) {
    return {
      ...state,
      loading: true,
      error: null
    };
  },
  [bitcoinTransferSucceeded](state) {
    return {
      ...state,
      loading: false,
    }
  },
  [bitcoinTransferFailed](state, { payload: { error } }) {
    return {
      ...state,
      loading: false,
      error
    }
  },
  [ethereumTransfer](state) {
    return {
      ...state,
      loading: true,
      error: null
    };
  },
  [ethereumTransferSucceeded](state) {
    return {
      ...state,
      loading: false,
    }
  },
  [ethereumTransferFailed](state, { payload: { error } }) {
    return {
      ...state,
      loading: false,
      error
    }
  },
  [setCurrency](state, { payload: { transferCurrency } }) {
    return {
      ...state,
      transferCurrency
    };
  },
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
    };
  },
  GET_COMMON_ESCROWS_SUCCEEDED: (state, { commonEscrows }) => ({
    ...state,
    gettingCommonEscrows: false,
    error: null,
    commonEscrows
  }),
  GET_COMMON_ESCROWS_FAILED: (state, { error }) => ({
    ...state,
    gettingCommonEscrows: false,
    error
  }),
  [setBuyerAddress](state, { payload: { address, saveAsDefault, username } }) {
    if (saveAsDefault) {
      storeShippingAddress(username, address);
      return {
        ...state,
        buyerAddress: address,
        defaultShippingAddress: address
      };
    }

    return {
      ...state,
      buyerAddress: address
    };
  },
  [loadDefaultShippingAddress](state, { payload: { username } }) {
    const defaultShippingAddress = getStoredShippingAddress(username);
    return {
      ...state,
      defaultShippingAddress
    };
  },
  [transferGetBtcTransactionFee](state, { payload: { id } }) {
    return {
      ...state,
      calculateBtcFeeId: id,
      gettingBtcFee: true,
      getBtcFeeError: null
    };
  },
  [transferGetBtcTransactionFeeFinished](state, { payload: { id, error, fee } }) {
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
  [transferResetTransactionFees](state) {
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
  [transferGetEthTransactionFee](state, { payload: { id } }) {
    return {
      ...state,
      calculateEthFeeId: id,
      gettingEthFee: true,
      getEthFeeError: null
    };
  },
  [transferGetEthTransactionFeeFinished](state, { payload: { id, error, maxFee, estimateFee } }) {
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
