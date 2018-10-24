import omnibazaarDHT from 'omnibazaar-dht';

let connector;
let isConnectorLoaded = false;

console.log({omnibazaarDHT})

export default class DHTConnector {
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
  init = async ({
    host,
    publishers = [],
    keywords = [],
    canPublish = true,
  } = {}) => {
    connector = omnibazaarDHT({ host, bootstrap: publishers });

    await connector.connect({ keywords, asPublisher: canPublish });
    isConnectorLoaded = true;

    return connector;
  }

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
  async reconnectIfNeeded({
    host,
    publishers = [],
    keywords = [],
    asPublisher = true,
  } = {}) {
    if (!connector) {
      await this.init({
        host,
        publishers,
        keywords,
        asPublisher,
      });
    }

    return connector;
  }

  /**
   *
   * @param {string} text
   *
   * @returns {Promise}
   */
  async findPeersFor(text) {
    await this.reconnectIfNeeded();

    try {
      const dhtPeers = await connector.findPeersFor(text);
      console.log({dhtPeers})
      return dhtPeers;
      // return connector.findPeersFor(text);
    } catch (e) {
      console.log('DHT ERROR', e);

      if (!connector || !isConnectorLoaded) {
        return this.findPeersFor(text);
      }

      throw e;
    }
  }

  disconnect = async () => {
    if (!connector) {
      return;
    }

    await connector.destroy();

    connector = null;
    isConnectorLoaded = false;
  }
}
