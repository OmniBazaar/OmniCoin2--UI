import { handleActions } from 'redux-actions';
import { dhtConnect, dhtGetPeersFor, dhtFetchPeersData } from './dhtActions';

const defaultState = {
  peers: [],
  isConnecting: false,
  connector: null,
  isLoading: false,
  error: null,
};

const reducer = handleActions({
  [dhtConnect](state) {
    return {
      ...state,
      isConnecting: true,
      error: null,
    };
  },

  DHT_CONNECT_SUCCEEDED: (state, { connector }) => ({
    ...state,
    isConnecting: false,
    connector,
  }),

  DHT_CONNECT_FAILED: (state, { error }) => ({
    ...state,
    isConnecting: false,
    error,
  }),

  [dhtGetPeersFor](state) {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  },

  DHT_FETCH_PEERS_SUCCEEDED: (state, { peers }) => {
    console.log('PEERS SUCCEEDED ', peers);
    return {
      ...state,
      isLoading: false,
      peers
    };
  },

  DHT_FETCH_PEERS_FAILED: (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })


}, defaultState);

export default reducer;
