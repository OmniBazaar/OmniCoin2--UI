import { handleActions } from 'redux-actions';
import {
  createWallet,
  getWallets,
  makePayment,
  getBalance,
  addAddress,
  toggleModal,
  toggleAddAddressModal,
  connectWallet,
  connectWalletFinish
} from './bitcoinActions';

const defaultState = {
  wallets: [],
  password: null,
  guid: null,
  isGettingWallets: false,
  loading: false,
  error: null,
  message: null,
  modal: {
    isOpen: false
  },
  addAddressModal: {
    isOpen: false
  },
  connectingWallet: false,
  connectWalletError: null
};

const reducer = handleActions({
  [createWallet](state, { payload: { password } }) {
    return {
      ...state,
      password,
      loading: true,
      error: null,
      message: null
    };
  },
  CREATE_WALLET_SUCCEEDED: (state, { guid }) => ({
    ...state,
    guid,
    loading: false,
    error: null
  }),
  CREATE_WALLET_FAILED: (state, { error }) => ({
    ...state,
    loading: false,
    password: null,
    error
  }),
  [getWallets](state) {
    return {
      ...state,
      isGettingWallets: true,
      loading: true,
      error: null,
      message: null
    };
  },
  GET_WALLETS_SUCCEEDED: (state, { wallets, guid, password }) => ({
    ...state,
    wallets,
    guid,
    password,
    isGettingWallets: false,
    loading: false,
    error: null
  }),
  GET_WALLETS_FAILED: (state, { error }) => ({
    ...state,
    isGettingWallets: false,
    loading: false,
    error
  }),
  [makePayment](state) {
    return {
      ...state,
      loading: true,
      error: null,
      message: null
    };
  },
  MAKE_PAYMENT_SUCCEEDED: (state, { response }) => ({
    ...state,
    loading: false,
    error: null,
    message: response
  }),
  MAKE_PAYMENT_FAILED: (state, { error }) => ({
    ...state,
    loading: false,
    error
  }),
  [getBalance](state) {
    return {
      ...state,
      loading: true,
      error: null,
      message: null
    };
  },
  GET_BALANCE_SUCCEEDED: (state, { response }) => ({
    ...state,
    loading: false,
    message: response
  }),
  GET_BALANCE_FAILED: (state, { error }) => ({
    ...state,
    loading: false,
    error,
    message: null
  }),
  [addAddress](state) {
    return {
      ...state,
      loading: true,
      error: null
    };
  },
  ADD_ADDRESS_SUCCEEDED: (state, { address }) => ({
    ...state,
    wallets: [...state.wallets, address],
    loading: false,
    error: null
  }),
  ADD_ADDRESS_FAILED: (state, { error }) => ({
    ...state,
    loading: true,
    error
  }),
  [toggleModal](state) {
    return {
      ...state,
      modal: {
        ...state.modal,
        isOpen: !state.modal.isOpen
      }
    };
  },
  [toggleAddAddressModal](state) {
    return {
      ...state,
      addAddressModal: {
        ...state.addAddressModal,
        isOpen: !state.addAddressModal.isOpen
      }
    };
  },
  [connectWallet](state) {
    return {
      ...state,
      connectingWallet: true,
      connectWalletError: null
    };
  },
  [connectWalletFinish](state, { payload: { error } }) {
    return {
      ...state,
      connectingWallet: false,
      connectWalletError: error
    };
  },
  LOGOUT: (state) => ({
    ...state,
    ...defaultState
  }),
}, defaultState);

export default reducer;
