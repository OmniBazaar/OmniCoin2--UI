import { createActions } from 'redux-actions';

const {
  dhtConnect,
  dhtGetPeersFor,
} = createActions({
  DHT_CONNECT: () => ({}),
  DHT_GET_PEERS_FOR: (searchTerm, category, country, city, searchListings = true, subCategory) => ({
    searchTerm, category, country, city, searchListings, subCategory
  }),
});

export {
  dhtConnect,
  dhtGetPeersFor,
};
