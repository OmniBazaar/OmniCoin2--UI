import {
  put,
  takeEvery,
  call,
  all
} from 'redux-saga/effects';

import _ from 'lodash';

import {Apis} from "omnibazaarjs-ws";
import {FetchChain} from "omnibazaarjs/es";

import {getGlobalObject} from '../blockchain/utils/miscellaneous';

export function* processorsSubscriber() {
  yield all([
    takeEvery('GET_TOP_PROCESSORS', getTopProcessors),
    takeEvery('GET_STANDBY_PROCESSORS', getStandbyProcessors),
  ]);
}

function* getTopProcessors() {
  try {
    const globalObject = yield call(getGlobalObject);
    let topProcessors = yield Apis.instance().db_api().exec('get_objects', [globalObject['active_witnesses']]);
    topProcessors = yield call(processProcessors, topProcessors);
    console.log('TOP PROCESSORS ', topProcessors);
    yield put({type: 'GET_TOP_PROCESSORS_SUCCEEDED', topProcessors})
  } catch (error) {
    console.log('ERROR', error);
    yield put({type: 'GET_TOP_PROCESSORS_FAILED', error})
  }
}

function* getStandbyProcessors() {
  try {
    const globalObject = yield call(getGlobalObject);
    const topProcessors = yield Apis.instance().db_api().exec('get_objects', [globalObject['active_witnesses']]);
    const allProcessors = yield Apis.instance().db_api().exec('lookup_witness_accounts', ['', 1000]);
    const standbyProcessorsIds = allProcessors
      .filter(el => !_.includes(topProcessors.map(proc => proc.id), el[1]))
      .map(el => el[1]);
    let standbyProcessors = yield Apis.instance().db_api().exec('get_objects', [standbyProcessorsIds]);
    standbyProcessors = yield call(processProcessors, standbyProcessors);
    yield put({type: 'GET_STANDBY_PROCESSORS_SUCCEEDED', standbyProcessors});
  } catch (error) {
    console.log('ERROR', error);
    yield put({type: 'GET_STANDBY_PROCESSORS_FAILED', error})
  }
}

async function processProcessors(processors) {
  let filteredPr = await Promise.all(
    processors.map(el => FetchChain('getAccount', el.witness_account).then(account => ({
      ...el,
      witness_account: account.toJS()
    })))
  );
  return _.sortBy(filteredPr, ['pop_score'], ['desc']).map((el, index) => ({
    ...el,
    rank: index + 1
  }));
}
