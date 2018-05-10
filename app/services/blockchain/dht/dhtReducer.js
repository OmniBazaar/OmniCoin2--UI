import { handleActions } from 'redux-actions';
import { dhtConnect } from './dhtActions';

const defaultState = {
  peersMap: {},
  isConnecting: false,
  connector: null,
  error: null,
};

const reducer = handleActions({
  [dhtConnect](state) {
    return {
      ...state,
      isConnecting: true,
    };
  },

  DHT_CONNECT_SUCCEEDED: (state, { connector }) => ({
    ...state,
    connector,
    isConnecting: false,
  }),

  DHT_CONNECT_FAILED: (state, { error }) => ({
    ...state,
    error,
    isConnecting: false,
  }),
}, defaultState);

export default reducer;
