import { createActions } from 'redux-actions';

const {
  exchangeBtc,
  exchangeBtcSucceeded,
  exchangeBtcFailed,
  exchangeEth,
  exchangeEthSucceeded,
  exchangeEthFailed
} = createActions({
  EXCHANGE_BTC: (guid, password, walletIdx, amount) => ({
    guid, password, walletIdx, amount
  }),
  EXCHANGE_BTC_SUCCEEDED: () => ({ }),
  EXCHANGE_BTC_FAILED: (error) => ({ error }),
  EXCHANGE_ETH: (privateKey, amount) => ({
    privateKey, amount
  }),
  EXCHANGE_ETH_SUCCEEDED: () => ({ }),
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
