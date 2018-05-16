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
    canPublish = true,
  } = {}) {
    connector = omnibazaarDHT({ host, bootstrap: publishers });

    await connector.connect({ keywords, asPublisher: canPublish })
      .catch(console.log);

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
    asPublisher = true,
  } = {}) {
    if (!connector) {
      return this.init({
        host,
        publishers,
        keywords,
        asPublisher,
      });
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

    return connector.findPeersFor(text);
  },
};

export default dhtConnector;
