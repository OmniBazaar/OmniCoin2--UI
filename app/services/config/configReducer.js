import { handleActions } from 'redux-actions';
import { getConfig, getConfigSucceeded, getConfigFailed } from "./configActions";
import { nodesAddresses, faucetAddresses } from './defaultConfig';

const defaultState = {
  faucets: [],
  nodes: [],
  loading: false,
  error: null
};

const reducer = handleActions({
  [getConfig](state) {
    return {
      ...state,
      loading: true,
      error: null
    }
  },
  [getConfigSucceeded](state, { payload: { config } }) {
    return {
      ...state,
      ...config,
      loading: false
    }
  },
  [getConfigFailed](state, { payload: { error } }) {
    return {
      ...state,
      faucets: faucetAddresses,
      nodes: nodesAddresses,
      error,
      loading: false
    }
  }
}, defaultState);

export default reducer;
