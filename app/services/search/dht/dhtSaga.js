import {
  all,
  call,
  put,
  takeEvery,
  fork
} from 'redux-saga/effects';
import { includes, uniqBy } from 'lodash';
import { Apis } from 'omnibazaarjs-ws';
import { FetchChain } from 'omnibazaarjs';

import DHTConnector from '../../../utils/dht-connector';
import { searchListingsByPeersMap } from '../searchSaga';
import AccountSettingsStorage from '../../accountSettings/accountStorage';
import { getPreferences } from '../../preferences/services';

const dhtPort = '8500';
const dhtConnector = new DHTConnector();

export function* dhtSubscriber() {
  yield all([
    takeEvery('DHT_CONNECT', connect),
    takeEvery('DHT_RECONNECT', reconnect),
    takeEvery('DHT_GET_PEERS_FOR', getPeersFor),
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

export function* reconnect() {
  yield call(dhtConnector.disconnect);
  yield put({ type: 'DHT_CONNECT' });
}

async function doLocalSearch({ country, city }) {
  const countryKey = `country:${country}`;
  const cityKey = `city:${city}`;

  const countryRes = country ? await dhtConnector.findPeersFor(countryKey) : noPeersFallback();
  const cityRes = city ? await dhtConnector.findPeersFor(cityKey) : noPeersFallback();

  return [...countryRes, ...cityRes];
}

function isPresentInFilters(
  host,
  {
    categoryResp, subCategoryResp, countryResp, cityResp
  },
  {
    category, subCategory, country, city
  }
) {
  const isInCategories = categoryResp && categoryResp.peers ? categoryResp.peers
    .find(({ host: ctgHost }) => ctgHost === host) : !category;
  const isInSubCategories = subCategoryResp && subCategoryResp.peers ? subCategoryResp.peers
    .find(({ host: subHost }) => subHost === host) : !subCategory;
  const isInCountry = countryResp && countryResp.peers ? countryResp.peers
    .find(({ host: contryHost }) => contryHost === host) : !country;
  const isInCity = cityResp && cityResp.peers ? cityResp.peers
    .find(({ host: cityHost }) => cityHost === host) : !city;

  return isInCategories && isInSubCategories && isInCountry && isInCity;
}

export function* getPeersFor({
  payload: {
    searchTerm, category, country, city, searchListings, subCategory, fromSearchMenu
  },
}) {
  try {
    if (!country) {
      city = '';
    }

    const publisherData = AccountSettingsStorage.getPublisherData();

    const categoryKey = category ? `category:${category}` : '';
    const subcategoryKey = subCategory ? `subcategory:${subCategory}` : '';

    let extraKeywordsResponse = yield Promise.all([
      (category !== 'All' && category !== 'featuredListings' && !subCategory) ? dhtConnector.findPeersFor(categoryKey) : noPeersFallback(),
      subCategory ? dhtConnector.findPeersFor(subcategoryKey) : noPeersFallback(),
    ]);

    if (publisherData.priority === 'local' && country) {
      extraKeywordsResponse.push(yield doLocalSearch(publisherData));
    }

    extraKeywordsResponse = extraKeywordsResponse.reduce((acc, curr) => [...acc, ...curr], []);

    let extraKeywordsPeers = extraKeywordsResponse
      .reduce((final, resp) => [...final, ...(resp.peers || [])], []);

    const [categoryResp, subCategoryResp, countryResp, cityResp] = extraKeywordsResponse;

    extraKeywordsPeers = uniqBy(extraKeywordsPeers, ({ host }) => host)
      .filter(({ host }) => isPresentInFilters(
        host,
        {
          categoryResp, subCategoryResp, countryResp, cityResp
        },
        {
          category, subCategory, country, city
        }
      ));

    const isPublisherSelected = publisherData.priority === 'publisher';

    if (isPublisherSelected) {
      extraKeywordsPeers = extraKeywordsPeers
        .filter(({ host }) => host === publisherData.publisherName.publisher_ip);
    }

    let keywords = searchTerm || [];

    if (typeof keywords === 'string') {
      keywords = searchTerm.split(' ').map(item => item.trim());
    }

    const responses = keywords.map(keyword => dhtConnector.findPeersFor(`keyword:${keyword}`));
    const allResponses = yield Promise.all(responses)
      .then(results => results.reduce((acc, curr) => [...acc, ...curr], []));

    console.log('Keywords results', allResponses);
    console.log('Extra keywords results', extraKeywordsResponse);

    let peersMap;

    if (keywords.length) {
      peersMap = allResponses.map((response) => ({
        keyword: response.keyword ? response.keyword.substring(8) : '',
        publishers: isPublisherSelected ?
          [{ host: publisherData.publisherName.publisher_ip }] :
          (response.peers || [])
            .filter(keyPeer => !extraKeywordsPeers.length || includes(extraKeywordsPeers
              .map(i => i.host), keyPeer.host)),
      })).filter(({ publishers }) => publishers.length);
    } else {
      peersMap = extraKeywordsResponse.map((response) => ({
        publishers: isPublisherSelected ?
          [{ host: publisherData.publisherName.publisher_ip }] :
          (response.peers || [])
            .filter(keyPeer => !extraKeywordsPeers.length || includes(extraKeywordsPeers
              .map(i => i.host), keyPeer.host)),
      })).filter(el => el.publishers.length);
    }

    peersMap = adjustPeersMap(peersMap);

    yield put({ type: 'DHT_FETCH_PEERS_SUCCEEDED', peersMap });

    const { searchListingOption } = getPreferences();

    if (peersMap.length !== 0 && searchListings) {
      yield fork(searchListingsByPeersMap, {
        payload: {
          peersMap,
          category,
          subCategory,
          searchTerm,
          country: country || publisherData.country,
          city: city || (country && publisherData.city) || '',
          searchByAllKeywords: !keywords.length || (searchListingOption && searchListingOption === 'allKeywords'),
          fromSearchMenu
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
    item.forEach(result => {
      if (result.noPeers) {
        return;
      }

      result.peers.forEach(peer => {
        if (!publishers[peer.host]) {
          publishers[peer.host] = peer.weight;
        } else {
          publishers[peer.host] += peer.weight;
        }
      });
    });
  });

  return publishers;
};

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
    publishers: uniqBy(item.publishers.map(publisher => ({
      address: publisher.host,
      weight: publishersWeights[publisher]
    })), 'address')
  }));
}

function noPeersFallback() {
  return [{
    noPeers: true,
    timedOut: false,
  }];
}
