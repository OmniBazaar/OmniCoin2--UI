import { handleActions } from 'redux-actions';
import {
  createWallet,
  getWallets,
  makePayment,
  getBalance
} from './bitcoinActions';

const defaultState = {
  wallets: [],
  loading: false,
  error: null,
  message: null
};

const reducer = handleActions({
  [createWallet](state, { payload: { password, privKey, label, email } }) {
    return {
      ...state,
      loading: true,
      error: null,
      message: null
    }
  },
  CREATE_WALLET_SUCCEEDED: (state, { wallet }) => {
    return {
      ...state,
      wallets: [...state.wallets, wallet],
      loading: false,
      error: null
    }
  },
  CREATE_WALLET_FAILED: (state, { error }) => {
    return {
      ...state,
      loading: false,
      error
    }
  },
  [getWallets](state, { payload: { password } }) {
    return {
      ...state,
      loading: true,
      error: null,
      message: null
    }
  },
  GET_WALLETS_SUCCEEDED: (state, { wallets }) => {
    return {
      ...state,
      wallets,
      loading: false,
      error: null
    }
  },
  GET_WALLETS_FAILED: (state, { error }) => {
    return {
      ...state,
      loading: false,
      error
    }
  },
  [makePayment](state, { payload: { password, to, amount, from, fee } }) {
    return  {
      ...state,
      loading: true,
      error: null,
      message: null
    }
  },
  MAKE_PAYMENT_SUCCEEDED: (state, { response }) => {
    return {
      ...state,
      loading: false,
      error: null,
      message: response
    }
  },
  MAKE_PAYMENT_FAILED: (state, { error }) => {
    return  {
      ...state,
      loading: false,
      error
    }
  },
  [getBalance](state, { payload: { password, address } }) {
    return {
      ...state,
      loading: true,
      error: null,
      message: null
    }
  },
  GET_BALANCE_SUCCEEDED: (state, { response }) => {
    return {
      ...state,
      loading: false,
      message: response
    }
  },
  GET_BALANCE_FAILED: (state, { error }) => {
    return {
      ...state,
      loading: false,
      error,
      message: null
    }
  }
});
