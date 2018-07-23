import { handleActions } from 'redux-actions';
import {
  createEthereumWallet,
  getEthereumWallets,
  makeEthereumPayment,
  getEthereumBalance,
  addEthereumAddress,
  toggleEthereumModal,
  toggleAddAddressEthereumModal,
  connectEthereumWallet,
  connectEthereumWalletFinish,
  getEthereumTransactions
} from './EthereumActions';

const defaultState = {
  wallets: [],
  balance: 0,
  trasactions: [],
  brainKey: null,
  privateKey: null,
  address: null,
  isGettingWallets: false,
  loading: false,
  error: null,
  message: null,
  modalEthereum: {
    isOpen: false
  },
  addAddressEthereumModal: {
    isOpen: false
  },
  connectingWallet: false,
  connectWalletError: null
};

const reducer = handleActions({
  [createEthereumWallet](state, { payload: { privateKey } }) {
    return {
      ...state,
      privateKey,
      loading: true,
      error: null,
      message: null
    };
  },
  CREATE_ETHEREUM_WALLET_SUCCEEDED: (state, { address, brainKey }) => ({
    ...state,
    address,
    brainKey,
    loading: false,
    error: null
  }),
  CREATE_ETHEREUM_WALLET_FAILED: (state, { error }) => ({
    ...state,
    loading: false,
    privateKey: null,
    error
  }),
  [getEthereumWallets](state) {
    return {
      ...state,
      isGettingWallets: true,
      loading: true,
      error: null,
      message: null
    };
  },
  GET_ETHEREUM_WALLETS_SUCCEEDED: (state, { wallets, address, privateKey, brainKey }) => ({
    ...state,
    wallets,
    address,
    privateKey,
    brainKey,
    isGettingWallets: false,
    loading: false,
    error: null
  }),
  GET_ETHEREUM_WALLETS_FAILED: (state, { error }) => ({
    ...state,
    isGettingWallets: false,
    loading: false,
    error
  }),
  [makeEthereumPayment](state) {
    return {
      ...state,
      loading: true,
      error: null,
      message: null
    };
  },
  MAKE_ETHEREUM_PAYMENT_SUCCEEDED: (state, { response }) => ({
    ...state,
    loading: false,
    error: null,
    message: response
  }),
  MAKE_ETHEREUM_PAYMENT_FAILED: (state, { error }) => ({
    ...state,
    loading: false,
    error
  }),
  [getEthereumBalance](state) {
    return {
      ...state,
      loading: true,
      error: null,
      message: null
    };
  },
  GET_ETHEREUM_BALANCE_SUCCEEDED: (state, { balance }) => ({
    ...state,
    balance: balance,
    loading: false
  }),
  GET_ETHEREUM_BALANCE_FAILED: (state, { error }) => ({
    ...state,
    loading: false,
    error,
    message: null
  }),
  [addEthereumAddress](state) {
    return {
      ...state,
      loading: true,
      error: null
    };
  },
  ADD_ETHEREUM_ADDRESS_SUCCEEDED: (state, { address }) => ({
    ...state,
    wallets: [...state.wallets, address],
    loading: false,
    error: null
  }),
  ADD_ETHEREUM_ADDRESS_FAILED: (state, { error }) => ({
    ...state,
    loading: true,
    error
  }),
  [toggleEthereumModal](state) {
    return {
      ...state,
      modalEthereum: {
        ...state.modal,
        isOpen: !state.modalEthereum.isOpen
      }
    };
  },
  [toggleAddAddressEthereumModal](state) {
    return {
      ...state,
      addAddressEthereumModal: {
        ...state.addAddressEthereumModal,
        isOpen: !state.addAddressEthereumModal.isOpen
      }
    };
  },
  [connectEthereumWallet](state) {
    return {
      ...state,
      connectingWallet: true,
      connectWalletError: null
    };
  },
  [connectEthereumWalletFinish](state, { error }) {
    return {
      ...state,
      connectingWallet: false,
      connectWalletError: error
    };
  },
  [getEthereumTransactions](state) {
    return {
      ...state,
      isGettingTransactions: true,
      loading: true,
      error: null,
      message: null
    };
  },
  GET_ETHEREUM_TRANSACTIONS_SUCCEEDED: (state, { transactions }) => ({
    ...state,
    transactions,
    isGettingTransactions: false,
    loading: false,
    error: null
  }),
  GET_ETHEREUM_TRANSACTIONS_FAILED: (state, { error }) => ({
    ...state,
    isGettingTransactions: false,
    loading: false,
    error
  })
}, defaultState);

export default reducer;
