import {
  all,
  call,
  put,
  takeEvery,
  takeLatest,
  fork,
  select
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { includes, uniqBy, forOwn } from 'lodash';
import { Apis } from 'omnibazaarjs-ws';
import { FetchChain } from 'omnibazaarjs';

import DHTConnector from '../../../utils/dht-connector';
import { searchListingsByPeersMap } from '../searchSaga';
import AccountSettingsStorage from '../../accountSettings/accountStorage';
import { getPreferences } from '../../preferences/services';
import { getAllPublishers } from '../../accountSettings/services';
import { checkAndUpdatePublishersAliveStatus } from '../../listing/listingSaga';
import {
  CATEGORY_IGNORED,
  SUBCATEGORY_IGNORED,
  searchListings as searchListingsAction
} from "../searchSaga";

const dhtPort = '8500';
const dhtConnector = new DHTConnector();

export function* dhtSubscriber() {
  yield all([
    takeLatest('DHT_CONNECT', connect),
    takeLatest('DHT_RECONNECT', reconnect),
    // takeLatest('DHT_GET_PEERS_FOR', getPeersFor),
  ]);
}

export function* connect() {
  let getAccountErrorHappened = false;

  try {
    const { priority, publisherName } = AccountSettingsStorage.getPublisherData();
    let ips = null;

    if (priority === 'publisher') {
      ips = [`${publisherName.publisher_ip}:${dhtPort}`];
    } else {
      const publishersAlive = yield getAlivePublisherIps();
      ips = Object.keys(publishersAlive).map(ip => `${ip}:${dhtPort}`);
    }

    const connector = yield call(dhtConnector.init, {
      publishers: ips
    });

    yield put({ type: 'DHT_CONNECT_SUCCEEDED', connector });
  } catch (e) {
    console.log('ERROR ', e);

    if (getAccountErrorHappened) {
      yield connect();
    } else {
      yield put({ type: 'DHT_CONNECT_FAILED', error: e.message });
    }
  }
}

export function* reconnect() {
  console.log('DHT RECONNECT');
  yield dhtConnector.disconnect();
  yield put({ type: 'DHT_CONNECT' });
}

// async function doLocalSearch({ country, state, city }) {
//   const countryKey = `country:${country}`;
//   const stateKey = `state:${state}`;
//   const cityKey = `city:${city}`;

//   return await Promise.all([
//     country ? dhtConnector.findPeersFor(countryKey) : noPeersFallback(),
//     state ? dhtConnector.findPeersFor(stateKey) : noPeersFallback(),
//     city ? dhtConnector.findPeersFor(cityKey) : noPeersFallback()
//   ]);
// }

// const checkPresent = (host, filter, dhtResp) => {
//   if (!filter) {
//     return true;
//   }

//   if (!dhtResp) {
//     return false;
//   }

//   for (let i = 0; i < dhtResp.length; i++) {
//     if (dhtResp[i].peers) {
//       const found = dhtResp[i].peers.find(({ host: pHost }) => pHost === host);
//       if (found) {
//         return true;
//       }
//     }
//   }

//   return false;
// }

// function isPresentInFilters(
//   host,
//   {
//     categoryResp, subCategoryResp, countryResp, stateResp, cityResp
//   },
//   {
//     category, subCategory, country, state, city
//   }
// ) {
//   if (category === 'All' || category === 'featuredListings') {
//     category = '';
//   }
//   if (subCategory === 'all') {
//     subCategory = '';
//   }

//   return (
//     checkPresent(host, category, categoryResp) &&
//     checkPresent(host, subCategory, subCategoryResp) &&
//     checkPresent(host, country, countryResp) &&
//     checkPresent(host, state, stateResp) &&
//     checkPresent(host, city, cityResp)
//   )
// }

export function* getAlivePublisherIps() {
  while (true) {
    const isCheckingPublishersStatus = (yield select()).default.listing.allPublishers.loading;
    if (!isCheckingPublishersStatus) {
      break;
    }
    yield delay(200);
  }

  let publishers = yield checkAndUpdatePublishersAliveStatus();
  publishers = publishers.filter(pub => pub.alive);

  const publisherIps = {};
  publishers.forEach((publisher) => {
    if (!publisherIps[publisher.publisher_ip]) {
      publisherIps[publisher.publisher_ip] = true;
    }
  });

  return publisherIps;
}

const dhtSearch = (key) => dhtConnector.findPeersFor(key);

const findHostsPresentInAllDhtResults = (dhtSearchResults) => {
  const resultHosts = dhtSearchResults.map(result => {
    const hosts = {};
    result.forEach(r => {
      if (r.peers) {
        r.peers.forEach(p => {
          if (!hosts[p.host]) {
            hosts[p.host] = true;
          }
        });
      }
    });

    return hosts;
  });

  if (resultHosts.length === 1) {
    return Object.keys(resultHosts[0]);
  }

  const hosts = [];
  Object.keys(resultHosts[0]).forEach(host => {
    for (let i = 1; i < resultHosts.length; i++) {
      if (!resultHosts[i][host]) {
        return;
      }
    }

    hosts.push(host);
  });

  return hosts;
}

/**
* return array of result host ips
*/
const searchMeta = async ({ category, subCategory, country, state, city }) => {
  const promises = [];

  if (category && CATEGORY_IGNORED.indexOf(category.toLowerCase()) === -1) {
    promises.push(dhtSearch(`category:${category}`));
  }

  if (subCategory && SUBCATEGORY_IGNORED.indexOf(subCategory.toLowerCase()) === -1) {
    promises.push(dhtSearch(`subcategory:${subCategory}`));
  }

  if (country) {
    promises.push(dhtSearch(`country:${country}`));
  }

  if (state) {
    promises.push(dhtSearch(`state:${state}`));
  }

  if (city) {
    promises.push(dhtSearch(`city:${city}`));
  }

  if (!promises.length) {
    return null;
  }

  const result = await Promise.all(promises);
  return findHostsPresentInAllDhtResults(result);
}

const searchKeywords = async (keywords, isSearchAll, filteredHosts) => {
  keywords = keywords.map(k => k.toLowerCase());
  const result = await Promise.all(keywords.map(keyword => dhtSearch(`keyword:${keyword}`)));
  const keywordsResults = {};
  result.forEach((dhtResults, index) => {
    const keyword = keywords[index];
    if (!dhtResults || !dhtResults.length) {
      keywordsResults[keyword] = {};
      return;
    }

    dhtResults.forEach(r => {
      if (!r.peers || !r.peers.length) {
        return;
      }

      if (!keywordsResults[keyword]) {
        keywordsResults[keyword] = {};
      }

      r.peers.forEach(peer => {
        const { host, weight } = peer;
        if (!keywordsResults[keyword][host]) {
          keywordsResults[keyword][host] = {
            address: host,
            weight
          };
        } else {
          keywordsResults[keyword][host].weight += weight;
        }
      });
    });
  });

  if (keywords.length === 1) {
    return keywordsResults;
  }

  let validHosts = null;

  if (isSearchAll) {
    const firstKeywordResult = keywordsResults[keywords[0]];
    validHosts = [];
    Object.keys(firstKeywordResult).forEach(host => {
      for (let i = 1; i < keywords.length; i++) {
        if (!keywordsResults[keywords[i]][host]) {
          return;
        }
      }
      if (filteredHosts && filteredHosts.indexOf(host) === -1) {
        return;
      }

      validHosts.push(host);
    });
  } else if (filteredHosts) {
    validHosts = filteredHosts;
  }

  if (!validHosts) {
    return keywordsResults;
  }

  if (!validHosts.length) {
    return {};
  }

  const searchResults = {};
  forOwn(keywordsResults, (hosts, keyword) => {
    validHosts.forEach(host => {
      if (hosts[host]) {
        if (!searchResults[keyword]) {
          searchResults[keyword] = {};
        } 
        searchResults[keyword][host] = hosts[host];
      }
    });
  });

  return searchResults;
}

export function* searchPeers({
  searchTerm, category, subCategory,
  country, state, city, isSearchByAllKeywords
}) {
  let { dht } = (yield select()).default;
  while (!dht.connector || dht.isConnecting) {
    yield delay(200);
    dht = (yield select()).default.dht;
  }

  let metaHosts = yield searchMeta({category, subCategory, country, state, city});
  let hasMetaSearch = metaHosts !== null;
  if (hasMetaSearch && !metaHosts.length) {
    return null;
  }

  const publisherData = AccountSettingsStorage.getPublisherData();
  const isPublisherSelected = publisherData.priority === 'publisher';
  if (isPublisherSelected) {
    const priorityPublisher = publisherData.publisherName.publisher_ip;
    if (!priorityPublisher) {
      return null;
    }

    if (hasMetaSearch && metaHosts.indexOf(priorityPublisher) === -1) {
      return null;
    }

    const publishersAlive = yield getAlivePublisherIps();
    if (!publishersAlive[priorityPublisher]) {
      return null;
    }

    metaHosts = [priorityPublisher];
    hasMetaSearch = true;
  }

  let keywords = searchTerm || [];
  if (typeof keywords === 'string') {
    keywords = keywords.trim();
    if (keywords) {
      keywords = keywords.split(' ').map(item => item.trim()).filter(item => item);
    } else {
      keywords = [];
    }
  }

  if (keywords.length) {
    const keywordSearchResults = yield searchKeywords(keywords, isSearchByAllKeywords, hasMetaSearch ? metaHosts : null);

    if (!Object.keys(keywordSearchResults).length) {
      return null;
    }
    if (isSearchByAllKeywords) {
      const publishersData = {};
      forOwn(keywordSearchResults, (hosts) => {
        forOwn(hosts, (pub, host) => {
          if (!publisherData[host]) {
            publishersData[host] = pub;
          } else {
            publishersData[host].weight += pub.weight;
          }
        });
      });

      const pubs = Object.keys(publishersData).map(h => publishersData[h]);
      if (!pubs.length) {
        return null;
      }

      return {
        keywords,
        publishers: pubs
      };
    } else {
      const keywordsData = [];
      forOwn(keywordSearchResults, (hosts, keyword) => {
        const ips = Object.keys(hosts);
        if (!ips.length) {
          return;
        }

        keywordsData.push({
          keyword,
          publishers: ips.map(h => hosts[h])
        });
      });

      if (!keywordsData.length) {
        return null;
      }

      return {
        keywords: keywordsData
      };
    }
  }

  if (hasMetaSearch) {
    const publishers = metaHosts.map(h => ({
      address: h,
      weight: 1
    }));

    return {
      keywords: [],
      publishers
    };
  }

  return null;
}

// export function* getPeersFor({
//   payload: {
//     searchTerm, category, country, state, city, searchListings, subCategory, fromSearchMenu
//   },
// }) {
//   try {
//     if (!country) {
//       city = '';
//       state = '';
//     }

//     const publisherData = AccountSettingsStorage.getPublisherData();

//     const categoryKey = category ? `category:${category}` : '';
//     const subcategoryKey = subCategory ? `subcategory:${subCategory}` : '';

//     let extraKeywordsResponse = yield Promise.all([
//       (category && category !== 'All' && category !== 'featuredListings') ? dhtConnector.findPeersFor(categoryKey) : noPeersFallback(),
//       (subCategory && subCategory !== 'all') ? dhtConnector.findPeersFor(subcategoryKey) : noPeersFallback(),
//     ]);

//     if (publisherData.priority === 'local' && country) {
//       const localRes = yield doLocalSearch(publisherData);
//       extraKeywordsResponse = [...extraKeywordsResponse, ...localRes];
//     }

//     const [categoryResp, subCategoryResp, countryResp, stateResp, cityResp] = extraKeywordsResponse;

//     extraKeywordsResponse = extraKeywordsResponse.reduce((acc, curr) => [...acc, ...curr], []);

//     let extraKeywordsPeers = extraKeywordsResponse
//       .reduce((final, resp) => [...final, ...(resp.peers || [])], []);

//     extraKeywordsPeers = uniqBy(extraKeywordsPeers, ({ host }) => host)
//       .filter(({ host }) => isPresentInFilters(
//         host,
//         {
//           categoryResp, subCategoryResp, countryResp, stateResp, cityResp
//         },
//         {
//           category, subCategory, country, state, city
//         }
//       ));

//     const isPublisherSelected = publisherData.priority === 'publisher';

//     if (isPublisherSelected) {
//       extraKeywordsPeers = extraKeywordsPeers
//         .filter(({ host }) => host === publisherData.publisherName.publisher_ip);
//     }

//     let keywords = searchTerm || [];

//     if (typeof keywords === 'string') {
//       keywords = searchTerm.split(' ').map(item => item.trim());
//     }

//     const responses = keywords.map(keyword => dhtConnector.findPeersFor(`keyword:${keyword}`));
//     const allResponses = yield Promise.all(responses)
//       .then(results => results.reduce((acc, curr) => [...acc, ...curr], []));

//     let peersMap;

//     const extraKeywordsPeerHosts = extraKeywordsPeers.map(i => i.host);

//     const publisherIps = yield getAlivePublisherIps();

//     if (keywords.length) {
//       const isExtraFilter = (
//         (category && category !== 'All' && category !== 'featuredListings') ||
//         (subCategory && subCategory !== 'all') ||
//         country ||
//         state ||
//         city
//       );
//       peersMap = allResponses.map((response) => ({
//         keyword: response.keyword ? response.keyword.substring(8) : '',
//         publishers: isPublisherSelected ?
//           [{ host: publisherData.publisherName.publisher_ip }] :
//           (response.peers || []).filter(keyPeer => (
//             publisherIps[keyPeer.host] &&
//             (
//               !isExtraFilter ||
//               includes(extraKeywordsPeerHosts, keyPeer.host)
//             )
//           )),
//       })).filter(({ publishers }) => publishers.length);
//     } else {
//       peersMap = extraKeywordsResponse.map((response) => ({
//         publishers: isPublisherSelected ?
//           [{ host: publisherData.publisherName.publisher_ip }] :
//           (response.peers || []).filter(keyPeer => (
//               publisherIps[keyPeer.host] &&
//               includes(extraKeywordsPeerHosts, keyPeer.host)
//           )),
//         })).filter(el => el.publishers.length);
//     }

//     peersMap.forEach((peerItem) => {
//       peerItem
//     });

//     peersMap = adjustPeersMap(peersMap);

//     yield put({ type: 'DHT_FETCH_PEERS_SUCCEEDED', peersMap });

//     const { searchListingOption } = getPreferences();

//     if (peersMap.length !== 0 && searchListings) {
//       yield fork(searchListingsByPeersMap, {
//         payload: {
//           peersMap,
//           category,
//           subCategory,
//           searchTerm,
//           country: country || publisherData.country,
//           state,
//           city: city || (country && publisherData.city) || '',
//           searchByAllKeywords: !keywords.length || (searchListingOption && searchListingOption === 'allKeywords'),
//           fromSearchMenu
//         }
//       });
//     }
//     // search for "test" keyword when there is no results at all
//     if (peersMap.length === 0 && !fromSearchMenu) {
//       yield put(searchListingsAction("test", 'All', country, state, city, true, null));
//     }
//   } catch (e) {
//     console.log('ERROR ', e);
//     yield put({ type: 'DHT_FETCH_PEERS_FAILED', error: e.message });
//   }
// }

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

// function getPublishersWeights(peersMap) {
//   const weights = {};
//   peersMap.forEach(item => {
//     item.publishers.forEach(publisher => {
//       if (!weights[publisher]) {
//         weights[publisher] = 1;
//       } else {
//         weights.publisher += 1;
//       }
//     });
//   });
//   return weights;
// }

// function adjustPeersMap(peersMap) {
//   const publishersWeights = getPublishersWeights(peersMap);
//   return peersMap.map(item => ({
//     keyword: item.keyword || null,
//     publishers: uniqBy(item.publishers.map(publisher => ({
//       address: publisher.host,
//       weight: publishersWeights[publisher]
//     })), 'address')
//   }));
// }

// function noPeersFallback() {
//   return [{
//     noPeers: true,
//     timedOut: false,
//   }];
// }
