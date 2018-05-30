import { createActions } from 'redux-actions';

const {
  dhtConnect,
  dhtGetPeersFor,
} = createActions({
  DHT_CONNECT: () => ({}),
  DHT_GET_PEERS_FOR: (searchTerm, category, searchListings = true) => ({ searchTerm, category, searchListings }),
});

export {
  dhtConnect,
  dhtGetPeersFor,
};
