import { createActions } from 'redux-actions';

const {
  dhtConnect,
  getPeers,
} = createActions({
  DHT_CONNECT: () => ({}),
  GET_PEERS: () => ({}),
});

export {
  dhtConnect,
  getPeers,
};
