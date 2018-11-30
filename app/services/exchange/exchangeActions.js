import { createActions } from 'redux-actions';

const {
  exchangeBtc,
  exchangeBtcSucceeded,
  exchangeBtcFailed,
  exchangeEth,
  exchangeEthSucceeded,
  exchangeEthFailed,
  exchangeRequestRates,
  exchangeRequestRatesFinished,
  exchangeRequestSale,
  exchangeRequestSaleFinished,
  exchangeSetInProgressPhase,
  exchangeMakeSaleSuccess
} = createActions({
  EXCHANGE_BTC: (guid, password, walletIdx, amount, formatMessage) => ({
    guid, password, walletIdx, amount, formatMessage
  }),
  EXCHANGE_BTC_SUCCEEDED: (txid) => ({ txid }),
  EXCHANGE_BTC_FAILED: (error) => ({ error }),
  EXCHANGE_ETH: (privateKey, amount, formatMessage) => ({
    privateKey, amount, formatMessage
  }),
  EXCHANGE_ETH_SUCCEEDED: (txid) => ({ txid }),
  EXCHANGE_ETH_FAILED: (error) => ({ error }),
  EXCHANGE_REQUEST_RATES: () => ({}),
  EXCHANGE_REQUEST_RATES_FINISHED: (error, rates) => ({ error, rates }),
  EXCHANGE_REQUEST_SALE: () => ({}),
  EXCHANGE_REQUEST_SALE_FINISHED: (error, sale) => ({ error, sale }),
  EXCHANGE_SET_IN_PROGRESS_PHASE: (phase) => ({ phase }),
  EXCHANGE_MAKE_SALE_SUCCESS: (progress) => ({ progress })
});

export {
  exchangeBtc,
  exchangeBtcFailed,
  exchangeBtcSucceeded,
  exchangeEth,
  exchangeEthFailed,
  exchangeEthSucceeded,
  exchangeRequestRates,
  exchangeRequestRatesFinished,
  exchangeRequestSale,
  exchangeRequestSaleFinished,
  exchangeSetInProgressPhase,
  exchangeMakeSaleSuccess
}
