import { createActions } from 'redux-actions';

const {
  submitTransfer,
  createEscrowTransaction,
  getCommonEscrows,
  setCurrency,
  saleBonus,
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
} = createActions({
  CREATE_ESCROW_TRANSACTION: (buyer, seller, escrow, amount, memo, transferToEscrow, expirationTime, listingId, listingTitle, listingCount) =>
    ({ buyer, seller, escrow, amount, memo, transferToEscrow, expirationTime, listingId, listingTitle, listingCount }),
  GET_COMMON_ESCROWS: (from, to) => ({ from, to }),
  SET_CURRENCY: (transferCurrency) => ({ transferCurrency }),
  SALE_BONUS: (seller, buyer) => ({ seller, buyer }),
  OMNICOIN_TRANSFER: (to, amount, memo, reputation, listingId, listingTitle, listingCount) =>
    ({ to, amount, memo, reputation, listingId, listingTitle, listingCount }),
  OMNICOIN_TRANSFER_SUCCEEDED: () => ({ }),
  OMNICOIN_TRANSFER_FAILED: (error) => ({ error }),
  BITCOIN_TRANSFER: (toBitcoinAddress, toName, guid, password, walletIdx, amount, listingId, listingTitle, listingCount) =>
    ({ toBitcoinAddress, toName, guid, password, walletIdx, amount, listingId, listingTitle, listingCount }),
  BITCOIN_TRANSFER_SUCCEEDED: () => ({ }),
  BITCOIN_TRANSFER_FAILED: (error) => ({ error }),
  ETHEREUM_TRANSFER: (toEthereumAddress, toName, privateKey, amount, listingId, listingTitle, listingCount) =>
    ({toEthereumAddress, toName, amount, privateKey, listingId, listingTitle, listingCount }),
  ETHEREUM_TRANSFER_SUCCEEDED: () => ({ }),
  ETHEREUM_TRANSFER_FAILED: (error) => ({ error }),
  SET_BUYER_ADDRESS: (address, saveAsDefault, username) => ({ address, saveAsDefault, username }),
  LOAD_DEFAULT_SHIPPING_ADDRESS: (username) => ({ username }),
  TRANSFER_GET_BTC_TRANSACTION_FEE: (guid, password, walletIdx, amount, toAddress) => ({
    guid, password, walletIdx, amount, toAddress, id: Date.now()
  }),
  TRANSFER_GET_BTC_TRANSACTION_FEE_FINISHED: (id, error, fee) => ({ id, error, fee }),
  TRANSFER_RESET_TRANSACTION_FEES: () => ({}),
  TRANSFER_GET_ETH_TRANSACTION_FEE: (privateKey, amount, toAddress) => ({privateKey, amount, toAddress, id: Date.now()}),
  TRANSFER_GET_ETH_TRANSACTION_FEE_FINISHED: (id, error, maxFee, estimateFee) => ({id, error, maxFee, estimateFee})
});

export {
  submitTransfer,
  createEscrowTransaction,
  getCommonEscrows,
  setCurrency,
  saleBonus,
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
};
