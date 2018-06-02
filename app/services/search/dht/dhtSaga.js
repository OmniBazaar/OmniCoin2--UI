import {
  all,
  call,
  put,
  takeEvery,
  select
} from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';
import { FetchChain } from 'omnibazaarjs';
import uuid from 'uuid/v4';

import DHTConnector from '../../../utils/dht-connector';
import { searching } from '../../search/searchActions';
import { ws, messageTypes } from '../../marketplace/wsSaga';

const searchByAllKeywords = false; //todo
const dhtPort = '8500';
let id = 0;

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
    const ips = (yield Promise.all(
        publishers.map(publisherName => FetchChain('getAccount', publisherName))
    )).map(publisher => publisher.get('publisher_ip') + ':' + dhtPort);
    const connector = yield call(dhtConnector.init, {
      publishers: ips
    });

    yield put({ type: 'DHT_CONNECT_SUCCEEDED', connector });
  } catch (e) {
    console.log('ERROR ', e);
    yield put({ type: 'DHT_CONNECT_FAILED', error: e.message });
  }
}

export function* getPeersFor({ payload: { searchTerm, category, searchListings } }) {
  console.log('SEARCH LISTINGS ', searchListings);
  const keywords = [...(searchTerm.split(' ')), category];
  try {
    const responses = yield Promise.all(keywords.map(keyword => dhtConnector.findPeersFor(keyword)));
    let peersMap = responses.map((response, index) => ({
        keyword: keywords[index],
        publishers: response.peers ? response.peers : []
    }));
    peersMap = adjustPeersMap(peersMap);
    yield put({ type: 'DHT_FETCH_PEERS_SUCCEEDED', peersMap });
    if (searchListings) {
      let message;
      if (searchByAllKeywords) {
        message = {
          id: id++,
          type: messageTypes.MARKETPLACE_SEARCH_BY_ALL_KEYWORDS_DATA_RECEIVED,
          command: {
            keywords: peersMap.reduce((keywords, curr) => [...keywords, curr.keyword], []),
            publishers: peersMap.reduce((publishers, curr) => [...publishsers, curr.publishers], []),
            currency: "BTC",
            range: "20"
          },
        };
        console.log(JSON.stringify(message, null, 2));
      } else {
        message = {
          id: id++,
          type: messageTypes.MARKETPLACE_SEARCH_BY_ANY_KEYWORD_DATA_RECEIVED,
          command: {
            keywords: peersMap,
            currency: "BTC",
            range: "20"
          },
        };
        console.log(JSON.stringify(message, null, 2));
      }
      ws.send(JSON.stringify(message));
      yield put(searching(id - 1));
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
      })
    )
  }))
}
