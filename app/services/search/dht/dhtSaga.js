import {
  all,
  call,
  put,
  takeEvery,
  fork
} from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';
import { FetchChain } from 'omnibazaarjs';
import DHTConnector from '../../../utils/dht-connector';
import { searchListingsByPeersMap } from '../searchSaga';

const dhtPort = '8500';
const dhtConnector = new DHTConnector();

export function* dhtSubscriber() {
  yield all([
    takeEvery('DHT_CONNECT', connect),
    takeEvery('DHT_GET_PEERS_FOR', getPeersFor),
  ]);
}

export function* connect() {
  try {
    const publishers = yield Apis.instance().db_api().exec('get_publisher_nodes_names', []);
    const ips = (yield Promise.all(publishers.map(publisherName => FetchChain('getAccount', publisherName))))
      .map(publisher => `${publisher.get('publisher_ip')}:${dhtPort}`);
    const connector = yield call(dhtConnector.init, {
      publishers: ips
    });

    yield put({ type: 'DHT_CONNECT_SUCCEEDED', connector });
  } catch (e) {
    console.log('ERROR ', e);
    yield put({ type: 'DHT_CONNECT_FAILED', error: e.message });
  }
}

export function* getPeersFor({
  payload: {
    searchTerm, category, country, city, searchListings, subCategory
  },
}) {
  try {
    const keywords = searchTerm ? [...(searchTerm.split(' '))] : [];
    const responses = keywords.map(keyword => dhtConnector.findPeersFor(`keyword:${keyword}`));
    const allResponses = yield Promise.all(responses);

    const categoryKey = `category:${category}`;
    const subcategoryKey = `category:${subCategory}`;
    const countryKey = `category:${country}`;
    const cityKey = `category:${city}`;

    keywords.push(categoryKey, subcategoryKey, countryKey, cityKey);

    const extraKeywordsResponse = yield Promise.all([
      category !== 'All' ? dhtConnector.findPeersFor(categoryKey) : noPeersFallback(),
      subCategory ? dhtConnector.findPeersFor(subcategoryKey) : noPeersFallback(),
      country ? dhtConnector.findPeersFor(countryKey) : noPeersFallback(),
      city ? dhtConnector.findPeersFor(cityKey) : noPeersFallback(),
    ]);

    allResponses.push(...extraKeywordsResponse);

    let peersMap = allResponses.map((response, index) => ({
      keyword: keywords[index],
      publishers: response.peers ? response.peers : []
    })).filter(el => el.publishers.length);

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
        }
      });
    }
  } catch (e) {
    console.log('ERROR ', e);
    yield put({ type: 'DHT_FETCH_PEERS_FAILED', error: e.message });
  }
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
    keyword: item.keyword,
    publishers: item.publishers.map(publisher => ({
      address: publisher.host,
      weight: publishersWeights[publisher]
    }))
  }));
}

function noPeersFallback() {
  return {
    noPeers: true,
    timedOut: false,
  };
}
