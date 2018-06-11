import {
  all,
  call,
  put,
  takeEvery,
  fork
} from 'redux-saga/effects';
import _ from 'lodash';
import { Apis } from 'omnibazaarjs-ws';
import { FetchChain } from 'omnibazaarjs';
import DHTConnector from '../../../utils/dht-connector';
import { searchListingsByPeersMap } from '../searchSaga';
import AccountSettingsStorage from '../../accountSettings/accountStorage';

const dhtPort = '8500';
const dhtConnector = new DHTConnector();

export function* dhtSubscriber() {
  yield all([
    takeEvery('DHT_CONNECT', connect),
    takeEvery('DHT_GET_PEERS_FOR', getPeersFor)
  ]);
}

export function* connect() {
  try {
    const { priority, publisherName } = AccountSettingsStorage.getPublisherData();
    let ips = [];

    if (priority === 'publisher') {
      ips = [`${publisherName.publisher_ip}:${dhtPort}`];
    } else {
      const publishers = yield Apis.instance()
        .db_api()
        .exec('get_publisher_nodes_names', []);
      ips = (yield Promise.all(publishers.map(publisher => FetchChain('getAccount', publisher))))
        .map(publisher => `${publisher.get('publisher_ip')}:${dhtPort}`);
    }

    const connector = yield call(dhtConnector.init, {
      publishers: ips
    });

    yield put({ type: 'DHT_CONNECT_SUCCEEDED', connector });
  } catch (e) {
    console.log('ERROR ', e);
    yield put({ type: 'DHT_CONNECT_FAILED', error: e.message });
  }
}

async function doLocalSearch({ country, city }) {
  const countryKey = `country:${country}`;
  const cityKey = `city:${city}`;

  const countryRes = await dhtConnector.findPeersFor(countryKey);
  const cityRes = await dhtConnector.findPeersFor(cityKey);

  return countryRes.peers ? countryRes.peers
    .filter(({ host }) => cityRes.peers && cityRes.peers
      .filter((peer) => peer.host === host)) : [];
}

export function* getPeersFor({
  payload: {
    searchTerm, category, country, city, searchListings, subCategory
  },
}) {
  try {
    const publisherData = AccountSettingsStorage.getPublisherData();
    const categoryKey = `category:${category}`;
    const subcategoryKey = `subcategory:${subCategory}`;

    const extraKeywordsResponse = yield Promise.all([
      category !== 'All' ? dhtConnector.findPeersFor(categoryKey) : noPeersFallback(),
      subCategory ? dhtConnector.findPeersFor(subcategoryKey) : noPeersFallback(),
    ]);

    let peers = [];

    switch (publisherData.priority) {
      case 'category':
        break;
      case 'local':
        peers = yield doLocalSearch(publisherData);
        break;
      default:
        break;
    }

    const keywords = searchTerm ? [...(searchTerm.split(' '))] : [];
    const responses = keywords.map(keyword => dhtConnector.findPeersFor(`keyword:${keyword}`));
    const allResponses = yield Promise.all(responses);

    console.log('Keywords results', allResponses);
    console.log('Extra keywords results', extraKeywordsResponse);

    let peersMap;

    if (keywords.length) {
      peersMap = allResponses.map((response, index) => ({
        keyword: keywords[index],
        publishers: response.peers ? response.peers : []
      })).filter(({ publishers }) => publishers.length);
    } else {
      peersMap = extraKeywordsResponse.map((response) => ({
        publishers: response.peers ? response.peers : []
      })).filter(el => el.publishers.length);
    }

    peersMap = adjustPeersMap(peersMap);

    yield put({ type: 'DHT_FETCH_PEERS_SUCCEEDED', peersMap });
    if (peersMap.length !== 0 && searchListings) {
      yield fork(searchListingsByPeersMap, {
        payload: {
          peersMap,
          category,
          country,
          city,
          subCategory,
          searchByAllKeywords: !keywords.length,
          searchTerm
        }
      });
    }
  } catch (e) {
    console.log('ERROR ', e);
    yield put({ type: 'DHT_FETCH_PEERS_FAILED', error: e.message });
  }
}

export const countPeersForKeywords = async (keywords) => {
  const responses = keywords.map(keyword => dhtConnector.findPeersFor(`keyword:${keyword}`));
  const allResponses = await Promise.all(responses);
  const publishers = {};

  allResponses.forEach(item => {
    if (item.noPeers) {
      return;
    }

    item.peers.forEach(peer => {
      if (!publishers[peer.host]) {
        publishers[peer.host] = 1;
      } else {
        publishers[peer.host]++;
      }
    });
  });

  return publishers;
}

function getPublishersWeights(peersMap) {
  const weights = {};
  peersMap.forEach(item => {
    item.publishers.forEach(publisher => {
      if (!weights[publisher]) {
        weights[publisher] = 1;
      } else {
        weights.publisher += 1;
      }
    });
  });
  return weights;
}

function adjustPeersMap(peersMap) {
  const publishersWeights = getPublishersWeights(peersMap);
  return peersMap.map(item => ({
    keyword: item.keyword || null,
    publishers: _.uniqBy(item.publishers.map(publisher => ({
      address: publisher.host,
      weight: publishersWeights[publisher]
    })), 'address')
  }));
}

function noPeersFallback() {
  return {
    noPeers: true,
    timedOut: false,
  };
}
