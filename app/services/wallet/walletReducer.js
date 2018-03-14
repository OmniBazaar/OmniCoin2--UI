import { handleActions, combineActions } from 'redux-actions';
import {
  getBitcoinWallets,
  getOmniCoinWallets,
} from './walletActions';

const defaultState = {
  omniCoinWallets: [],
  bitCoinWallets: [],
};

const reducer = handleActions({
  [combineActions(getBitcoinWallets)](state, { payload: { bitCoinWallets } }) {
    return {
      ...state,
      bitCoinWallets
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
