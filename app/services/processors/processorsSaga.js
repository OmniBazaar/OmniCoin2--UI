import {
  put,
  takeEvery,
  takeLatest,
  call,
  select,
  all
} from 'redux-saga/effects';

import _ from 'lodash';

import { Apis } from 'omnibazaarjs-ws';
import { FetchChain } from 'omnibazaarjs/es';

import { getGlobalObject, fetchAccount } from '../blockchain/utils/miscellaneous';
import { voteForProcessors } from "./utils";

export function* processorsSubscriber() {
  yield all([
    takeEvery('GET_TOP_PROCESSORS', getTopProcessors),
    takeEvery('GET_STANDBY_PROCESSORS', getStandbyProcessors),
    takeLatest('COMMIT_PROCESSORS_TOP', commitTopProcessors),
    takeLatest('COMMIT_PROCESSORS_STAND_BY', commitStandbyProcessors)
  ]);
}

export const getActiveWitnesses = async () => {
  const globalObject = await getGlobalObject();
  let topProcessors = await Apis.instance().db_api().exec('get_objects', [globalObject.active_witnesses]);
  topProcessors = await processProcessors(topProcessors);

  return topProcessors;
}

function* getTopProcessors() {
  try {
    const { currentUser } = (yield select()).default.auth;
    let topProcessors = yield call(getActiveWitnesses);
    topProcessors = yield call(addApproveField, topProcessors, currentUser.username);
    yield put({ type: 'GET_TOP_PROCESSORS_SUCCEEDED', topProcessors });
  } catch (error) {
    console.log('ERROR', error);
    yield put({ type: 'GET_TOP_PROCESSORS_FAILED', error });
  }
}

function* getStandbyProcessors() {
  try {
    const globalObject = yield call(getGlobalObject);
    const { currentUser } = (yield select()).default.auth;
    const topProcessors = yield Apis.instance().db_api().exec('get_objects', [globalObject.active_witnesses]);
    const allProcessors = yield Apis.instance().db_api().exec('lookup_witness_accounts', ['', 1000]);
    const standbyProcessorsIds = allProcessors
      .filter(el => !_.includes(topProcessors.map(proc => proc.id), el[1]))
      .map(el => el[1]);
    let standbyProcessors = yield Apis.instance().db_api().exec('get_objects', [standbyProcessorsIds]);
    standbyProcessors = yield call(processProcessors, standbyProcessors);
    console.log('STANDARD PROCESSORS', standbyProcessors);
    standbyProcessors = yield call(addApproveField, standbyProcessors, currentUser.username);
    yield put({ type: 'GET_STANDBY_PROCESSORS_SUCCEEDED', standbyProcessors });
  } catch (error) {
    console.log('ERROR', error);
    yield put({ type: 'GET_STANDBY_PROCESSORS_FAILED', error });
  }
}

function* commitTopProcessors() {
  const {
    toggledProcessors,
    topProcessors
  } = (yield select()).default.processorsTop;
  const { standbyProcessors } = (yield select()).default.processorsStandby;
  const { currentUser } = (yield select()).default.auth;
  const account = yield call(fetchAccount, currentUser.username);
  try {
    yield call(
      commitProcessors,
      [...topProcessors, ...standbyProcessors],
      toggledProcessors,
      account,
      currentUser.password
    );
    yield put({ type: 'COMMIT_TOP_PROCESSORS_SUCCEEDED' });
  } catch (error) {
    yield put({ type: 'COMMIT_TOP_PROCESSORS_FAILED', error });
  }
}

function* commitStandbyProcessors() {
  const {
    toggledProcessors,
    standbyProcessors
  } = (yield select()).default.processorsStandby;
  const { topProcessors } = (yield select()).default.processorsTop;
  const { currentUser } = (yield select()).default.auth;
  const account = yield call(fetchAccount, currentUser.username);
  try {
    yield call(
      commitProcessors,
      [...topProcessors, ...standbyProcessors],
      toggledProcessors,
      account,
      currentUser.password
    );
    yield put({ type: 'COMMIT_STANDBY_PROCESSORS_SUCCEEDED' });
  } catch (error) {
    yield put({ type: 'COMMIT_STANDBY_PROCESSORS_FAILED', error });
  }
}


async function commitProcessors(processors, toggledProcessors, account, password) {
  const approvedProcessors = processors
    .filter(processor => processor.approve);

  const voteIds = [];
  const processorWitnessIds = [];
  approvedProcessors.forEach(proc => {
    voteIds.push(proc.vote_id);
    processorWitnessIds.push(proc.witness_account.id);
  });
  await voteForProcessors(voteIds, processorWitnessIds, account, password);
}


async function processProcessors(processors) {
  const filteredPr = await Promise.all(processors.map(el => FetchChain('getAccount', el.witness_account).then(account => ({
    ...el,
    witness_account: account.toJS()
  }))));
  return _.sortBy(filteredPr, ['pop_score'], ['desc']).map((el, index) => ({
    ...el,
    rank: index + 1
  }));
}

async function addApproveField(processors, username) {
  const account = await fetchAccount(username);
  return processors.map(processor => ({
    ...processor,
    approve: account.options.votes.includes(processor.vote_id)
  }));
}
