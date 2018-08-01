import { handleActions, combineActions } from 'redux-actions';
import {
  getBitcoinWallets,
  getEtherWallets,
  getOmniCoinWallets,
} from './walletActions';

const defaultState = {
  omniCoinWallets: [],
  bitCoinWallets: [],
  ethereumWallets: [],
};

const reducer = handleActions({
  [combineActions(getBitcoinWallets)](state, { payload: { bitCoinWallets } }) {
    return {
      ...state,
      bitCoinWallets
    };
  },
  [combineActions(getEtherWallets)](state, { payload: { ethereumWallets } }) {
    return {
      ...state,
      ethereumWallets
    };
  },
  [combineActions(getOmniCoinWallets)](state, { payload: { omniCoinWallets } }) {
    return {
      ...state,
      omniCoinWallets
    };
  },
}, defaultState);

export default reducer;
