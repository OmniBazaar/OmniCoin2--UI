import omnibazaarDHT from 'omnibazaar-dht';

let connector;

const dhtConnector = {
  /**
   * Creates a new instance of the connector
   *
   * @param {Object} config
   * @param {string} config.host
   * @param {array} config.publishers - items must be in the format host:port
   * @param {array} config.keywords - could be strings or { keyword, weight } objects
   *
   * @returns {Promise}
   */
  async init({
    host,
    publishers = [],
    keywords = [],
  } = {}) {
    connector = omnibazaarDHT({ host, bootstrap: publishers });

    await connector.connect({ keywords }).catch(console.log);

    return connector;
  },

  /**
   * @returns {boolean}
   */
  alreadyConnected() {
    return !!connector;
  },

  /**
   * Will try to reconnect to the DHT if no connected already
   *
   * @param {Object} config
   * @param {string} config.host
   * @param {array} config.publishers - items must be in the format host:port
   * @param {array} config.keywords - could be strings or { keyword, weight } objects
   *
   * @returns {Promise}
   */
  reconnectIfNeeded({
    host,
    publishers = [],
    keywords = [],
  } = {}) {
    if (!connector) {
      console.log('Restarting dht...');
      return this.init({ host, publishers, keywords });
    }

    return Promise.resolve(connector);
  },

  /**
   *
   * @param {Object} data
   * @param {string} data.payload
   *
   * @returns {Promise}
   */
  async findPeersFor(text) {
    await this.reconnectIfNeeded();

    const lookupPromise = new Promise((resolve) => {
      connector.listenPeerLookup((response) => {
        resolve(response);
      });
    });

    const { nodeWithPeers } = await connector.findPeersFor(text);

    if (!nodeWithPeers) {
      return Promise.resolve({ noPeers: true });
    }

    return lookupPromise;
  },
};

export default dhtConnector;
