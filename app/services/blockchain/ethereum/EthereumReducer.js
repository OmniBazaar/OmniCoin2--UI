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
  connectEthereumWalletFinish
} from './EthereumActions';

const defaultState = {
  wallets: [],
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
  CREATE_ETHEREUM_WALLET_SUCCEEDED: (state, { address }) => ({
    ...state,
    address,
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
  GET_ETHEREUM_WALLETS_SUCCEEDED: (state, { wallets, address, privateKey }) => ({
    ...state,
    wallets,
    address,
    privateKey,
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
  GET_ETHEREUM_BALANCE_SUCCEEDED: (state, { response }) => ({
    ...state,
    loading: false,
    message: response
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
  [connectEthereumWalletFinish](state, { payload: { error } }) {
    return {
      ...state,
      connectingWallet: false,
      connectWalletError: error
    };
  }
}, defaultState);

export default reducer;
