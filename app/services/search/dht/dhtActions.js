import { createActions } from 'redux-actions';

const {
  dhtConnect,
  dhtGetPeersFor,
  dhtFetchPeersData,
} = createActions({
  DHT_CONNECT: () => ({}),
  DHT_GET_PEERS_FOR: text => text,
  DHT_FETCH_PEERS_DATA: peers => peers,
});

export {
  dhtConnect,
  dhtGetPeersFor,
  dhtFetchPeersData,
};
