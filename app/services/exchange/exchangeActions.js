import { createActions } from 'redux-actions';

const {
  exchangeBtc,
  exchangeBtcSucceeded,
  exchangeBtcFailed,
  exchangeEth,
  exchangeEthSucceeded,
  exchangeEthFailed,
  exchangeRequestSale,
  exchangeRequestSaleFinished,
  exchangeSetInProgressPhase,
  exchangeMakeSaleSuccess,
  getBtcTransactionFee,
  getBtcTransactionFeeFinished,
  resetTransactionFees,
  getEthTransactionFee,
  getEthTransactionFeeFinished
} = createActions({
  EXCHANGE_BTC: (guid, password, walletIdx, amount, formatMessage) => ({
    guid, password, walletIdx, amount, formatMessage
  }),
  EXCHANGE_BTC_SUCCEEDED: (txid) => ({ txid }),
  EXCHANGE_BTC_FAILED: (error) => ({ error }),
  EXCHANGE_ETH: (privateKey, amount, estimatedFee, formatMessage) => ({
    privateKey, amount, estimatedFee, formatMessage
  }),
  EXCHANGE_ETH_SUCCEEDED: (txid) => ({ txid }),
  EXCHANGE_ETH_FAILED: (error) => ({ error }),
  EXCHANGE_REQUEST_SALE: (onlyRates) => ({onlyRates}),
  EXCHANGE_REQUEST_SALE_FINISHED: (error, sale, onlyRates) => ({ error, sale, onlyRates }),
  EXCHANGE_SET_IN_PROGRESS_PHASE: (inProgressPhase, waitingPhase) => ({ inProgressPhase, waitingPhase }),
  EXCHANGE_MAKE_SALE_SUCCESS: (progress) => ({ progress }),
  GET_BTC_TRANSACTION_FEE: (guid, password, walletIdx, amount) => ({
    guid, password, walletIdx, amount, id: Date.now()
  }),
  GET_BTC_TRANSACTION_FEE_FINISHED: (id, error, fee) => ({ id, error, fee }),
  RESET_TRANSACTION_FEES: () => ({}),
  GET_ETH_TRANSACTION_FEE: (privateKey, amount) => ({privateKey, amount, id: Date.now()}),
  GET_ETH_TRANSACTION_FEE_FINISHED: (id, error, maxFee, estimateFee) => ({id, error, maxFee, estimateFee})
});

export {
  exchangeBtc,
  exchangeBtcFailed,
  exchangeBtcSucceeded,
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
}
