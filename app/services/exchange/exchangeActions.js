import { createActions } from 'redux-actions';

const {
  exchangeBtc,
  exchangeBtcSucceeded,
  exchangeBtcFailed,
  exchangeEth,
  exchangeEthSucceeded,
  exchangeEthFailed
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
  EXCHANGE_ETH_FAILED: (error) => ({ error })
});

export {
  exchangeBtc,
  exchangeBtcFailed,
  exchangeBtcSucceeded,
  exchangeEth,
  exchangeEthFailed,
  exchangeEthSucceeded
}
