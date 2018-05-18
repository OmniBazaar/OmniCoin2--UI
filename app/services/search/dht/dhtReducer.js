import { handleActions } from 'redux-actions';
import { dhtConnect, dhtGetPeersFor, dhtFetchPeersData } from './dhtActions';

const defaultState = {
  peersMap: {},
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

  [dhtGetPeersFor](state) {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  },

  [dhtFetchPeersData](state, { peers }) {
    console.log('Reducer peers', peers);

    return {
      ...state,
      isLoading: true,
      error: null,
    };
  },

  DHT_SEARCH_SUCCEEDED: (state, { searchResult: { keyword, data } }) => ({
    ...state,
    peersMap: {
      ...state.peersMap,
      [keyword]: data,
    },
    isLoading: false,
    error: null,
  }),

  DHT_SEARCH_FAILED: (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  }),

  DHT_CONNECT_SUCCEEDED: (state, { connector }) => ({
    ...state,
    connector,
    error: null,
    isConnecting: false,
  }),

  DHT_CONNECT_FAILED: (state, { error }) => ({
    ...state,
    error,
    isConnecting: false,
  }),

  DHT_FETCH_PEERS_FAILED: (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })
}, defaultState);

export default reducer;
