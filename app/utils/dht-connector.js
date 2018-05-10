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
  }) {
    connector = omnibazaarDHT({ host, bootstrap: publishers });

    await connector.connect({ keywords })
      .catch(console.log);

    return connector;
  },

  /**
   * @returns {boolean}
   */
  alreadyConnected() {
    return !!connector;
  }
};

export default dhtConnector;
