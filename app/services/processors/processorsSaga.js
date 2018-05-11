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
import { FetchChain, TransactionBuilder } from 'omnibazaarjs/es';

import { getGlobalObject, fetchAccount } from '../blockchain/utils/miscellaneous';
import { generateKeyFromPassword } from '../blockchain/utils/wallet';

export function* processorsSubscriber() {
  yield all([
    takeEvery('GET_TOP_PROCESSORS', getTopProcessors),
    takeEvery('GET_STANDBY_PROCESSORS', getStandbyProcessors),
    takeLatest('COMMIT_PROCESSORS_TOP', commitTopProcessors),
    takeLatest('COMMIT_PROCESSORS_STAND_BY', commitStandbyProcessors)
  ]);
}

function* getTopProcessors() {
  try {
    const globalObject = yield call(getGlobalObject);
    const { currentUser } = (yield select()).default.auth;
    let topProcessors = yield Apis.instance().db_api().exec('get_objects', [globalObject.active_witnesses]);
    topProcessors = yield call(processProcessors, topProcessors);
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
  const voteIds = processors
    .filter(processor => processor.approve)
    .map(processor => processor.vote_id);
  const tr = new TransactionBuilder();
  tr.add_type_operation('account_update', {
    account: account.id,
    new_options: {
      votes: voteIds,
      memo_key: account.options.memo_key,
      voting_account: '1.2.5',
      num_witness: voteIds.length,
      num_committee: 0
    }
  });
  const key = generateKeyFromPassword(account.name, 'active', password);
  await tr.set_required_fees();
  await tr.add_signer(key.privKey, key.pubKey);
  await tr.broadcast();
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
