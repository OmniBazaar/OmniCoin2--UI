import { handleActions } from 'redux-actions';
import { dhtConnect, dhtGetPeersFor, dhtFetchPeersData } from './dhtActions';

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

  [dhtGetPeersFor](state) {
    return { ...state };
  },

  [dhtFetchPeersData](state, { peers }) {
    console.log('Reducer peers', peers);

    return { ...state };
  },

  DHT_SEARCH_SUCCEEDED: (state, { searchResult: { keyword, data } }) => ({
    ...state,
    peersMap: {
      ...state.peersMap,
      [keyword]: data,
    },
    error: null,
  }),

  DHT_SEARCH_FAILED: (state, { error }) => ({
    ...state,
    error,
  }),

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

  DHT_FETCH_PEERS_FAILED: (state, { error }) => ({
    ...state,
    error,
  })
}, defaultState);

export default reducer;
