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
    topProcessors = yield Promise.all(
      topProcessors.map(el => FetchChain('getAccount', el.witness_account).then(account => ({
        ...el,
        witness_account: account.toJS()
      }))));
    topProcessors = _.sortBy(topProcessors, ['pop_score'], ['desc']).map((el, index) => ({
      ...el,
      rank: index + 1
    }));
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
    standbyProcessors = yield Promise.all(
      standbyProcessors.map(el => FetchChain('getAccount', el.witness_account).then(account => ({
        ...el,
        witness_account: account.toJS()
      }))));
    standbyProcessors = _.sortBy(standbyProcessors, ['pop_score'], ['desc']).map((el, index) => ({
      ...el,
      rank: index + 1
    }));
    yield put({type: 'GET_STANDBY_PROCESSORS_SUCCEEDED', standbyProcessors});
  } catch (error) {
    console.log('ERROR', error);
    yield put({type: 'GET_STANDBY_PROCESSORS_FAILED', error})
  }
}
