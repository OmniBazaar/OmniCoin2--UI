import { createActions } from 'redux-actions';

const {
  dhtConnect,
  dhtReconnect,
  dhtGetPeersFor,
} = createActions({
  DHT_CONNECT: () => ({}),
  DHT_RECONNECT: () => ({}),
  DHT_GET_PEERS_FOR: (searchTerm, category, country, state, city, searchListings = true, subCategory) => ({
    searchTerm, category, country, state, city, searchListings, subCategory
  }),
});

export {
  dhtConnect,
  dhtReconnect,
  dhtGetPeersFor,
};
