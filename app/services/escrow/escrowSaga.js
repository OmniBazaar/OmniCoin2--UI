import {
  put,
  takeEvery,
  call,
  all,
  takeLatest,
  select
} from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';
import { TransactionBuilder, FetchChain, ChainStore } from 'omnibazaarjs/es';
import _ from 'lodash';

import { updateAccount } from '../accountSettings/accountSaga';
import { parseEscrowTransactions } from './escrowUtils';
import { generateKeyFromPassword } from '../blockchain/utils/wallet';
import {
  getEscrowSettingsFailed,
  getEscrowSettingsSucceeded,
  updateEscrowSettingsFailed,
  updateEscrowSettingsSucceeded,
  createEscrowExtendProposalSucceeded,
  createEscrowExtendProposalFailed,
  getEscrowProposalsSucceeded,
  getEscrowProposalsFailed
} from './escrowActions';
import {
  getEscrowSettings as getEscrowSettingsService,
  getEscrowAgents as getEscrowAgentsService,
  getImplicitEscrows
} from './services';
import { getObjectById } from "../listing/apis";

export function* escrowSubscriber() {
  yield all([
    takeEvery('LOAD_ESCROW_TRANSACTIONS', loadEscrowTransactions),
    takeLatest('LOAD_ESCROW_AGENTS', loadEscrowAgents),
    takeEvery('LOAD_MY_ESCROW_AGENTS', loadMyEscrowAgents),
    takeEvery('SET_MY_ESCROW_AGENTS', setMyEscrowAgents),
    takeEvery('GET_ESCROW_AGENTS_COUNT', getEscrowAgentsCount),
    takeEvery('RELEASE_ESCROW_TRANSACTION', releaseEscrowTransaction),
    takeEvery('RETURN_ESCROW_TRANSACTION', returnEscrowTransaction),
    takeEvery('UPDATE_ESCROW_SETTINGS', updateEscrowSettings),
    takeEvery('GET_ESCROW_SETTINGS', getEscrowSettings),
    takeEvery('CREATE_ESCROW_EXTEND_PROPOSAL', createEscrowExtendProposal),
    takeEvery('GET_ESCROW_PROPOSALS', getEscrowProposals)
  ]);
}

function* loadEscrowTransactions(action) {
  const { username } = action.payload;
  try {
    const escrowObjects = yield (Apis.instance().db_api().exec('get_escrow_objects', [username]));
    yield put({
      type: 'LOAD_ESCROW_TRANSACTIONS_DONE',
      transactions: yield call(parseEscrowTransactions, escrowObjects, username)
    });
  } catch (e) {
    yield put({
      type: 'LOAD_ESCROW_TRANSACTIONS_FAILED',
      error: e
    });
  }
}

function* getAgentEscrowFee(escrow) {
  const agent = yield (Apis.instance().db_api().exec('get_account_by_name', [escrow.name]));
  const escrowFee = agent.escrow_fee / 100;
  return {
    ...escrow,
    escrowFee
  }
}


function* loadEscrowAgents({
  payload: {
    start, limit, searchTerm
  }
}) {
  try {
    const result = yield (Apis.instance().db_api().exec('filter_current_escrows', [
      start,
      limit,
      searchTerm
    ]));

    const agents = yield result.map(escrow => call(getAgentEscrowFee, escrow));

    yield put({
      type: 'LOAD_ESCROW_AGENTS_SUCCEEDED',
      agents
    });
  } catch (e) {
    yield put({
      type: 'LOAD_ESCROW_AGENTS_FAILED',
      error: e
    });
    console.log('ERROR ', e);
  }
}

function* loadMyEscrowAgents() {
  try {
    const { account } = (yield select()).default.auth;
    let escrows = yield call(getEscrowAgentsService, account.name);
    const implicitEscrows = yield call(getImplicitEscrows, account.id);
    escrows = _.union(escrows, implicitEscrows);
    const myAgents = escrows.map(item => ({ id: item }));

    yield put({
      type: 'LOAD_MY_ESCROW_AGENTS_SUCCEEDED',
      myAgents,
    });
  } catch (e) {
    yield put({
      type: 'LOAD_MY_ESCROW_AGENTS_FAILED',
      error: e
    });
    console.log('ERROR ', e);
  }
}

function* setMyEscrowAgents({ payload: { agents } }) {
  try {
    yield updateAccount({
      escrows: agents.map(agent => agent.id)
    });
    yield put({
      type: 'SET_MY_ESCROW_AGENTS_SUCCEEDED'
    });
  } catch (e) {
    console.log('ERROR ', e);
    yield put({
      type: 'SET_MY_ESCROW_AGENTS_FAILED',
      error: e
    });
  }
}

function* getEscrowAgentsCount() {
  try {
    const result = yield Apis.instance().db_api().exec('get_number_of_escrows', []);
    yield put({
      type: 'GET_ESCROW_AGENTS_COUNT_SUCCEEDED',
      count: result
    });
  } catch (e) {
    console.log('ERROR ', e);
    yield put({
      type: 'GET_ESCROW_AGENTS_COUNT_FAILED',
      error: e
    });
  }
}

function* releaseEscrowTransaction({ payload: { escrowObject, votes } }) {
  try {
    const keys = Object.keys(votes);
    const { currentUser } = (yield select()).default.auth;
    const [payingAcc, buyerAcc, escrowAcc, sellerAcc] = yield Promise.all([
      FetchChain('getAccount', currentUser.username),
      FetchChain('getAccount', escrowObject.buyer),
      FetchChain('getAccount', escrowObject.escrow),
      FetchChain('getAccount', escrowObject.seller)
    ]);
    const tr = new TransactionBuilder();
    tr.add_type_operation('escrow_release_operation', {
      fee_paying_account: payingAcc.get('id'),
      escrow: escrowObject.transactionID,
      buyer_account: buyerAcc.get('id'),
      escrow_account: escrowAcc.get('id'),
      seller_account: sellerAcc.get('id'),
      [`reputation_vote_for_${keys[0]}`]: votes[keys[0]],
      [`reputation_vote_for_${keys[1]}`]: votes[keys[1]],
      [`reputation_vote_for_${keys[2]}`]: votes[keys[2]],
      is_sale: !!escrowObject.listingID
    });
    const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
    yield tr.set_required_fees();
    yield tr.add_signer(key.privKey, key.pubKey);
    yield tr.broadcast();
    yield put({ type: 'RELEASE_ESCROW_TRANSACTION_SUCCEEDED', releasedTransaction: escrowObject });
  } catch (error) {
    console.log('ERROR ', error);
    yield put({ type: 'RELEASE_ESCROW_TRANSACTION_FAILED', error });
  }
}

function* returnEscrowTransaction({ payload: { escrowObject, votes } }) {
  try {
    const keys = Object.keys(votes);
    const { currentUser } = (yield select()).default.auth;
    const [payingAcc, sellerAcc, escrowAcc, buyerAcc] = yield Promise.all([
      FetchChain('getAccount', currentUser.username),
      FetchChain('getAccount', escrowObject.seller),
      FetchChain('getAccount', escrowObject.escrow),
      FetchChain('getAccount', escrowObject.buyer)
    ]);
    const tr = new TransactionBuilder();
    tr.add_type_operation('escrow_return_operation', {
      fee_paying_account: payingAcc.get('id'),
      escrow: escrowObject.transactionID,
      seller_account: sellerAcc.get('id'),
      escrow_account: escrowAcc.get('id'),
      buyer_account: buyerAcc.get('id'),
      [`reputation_vote_for_${keys[0]}`]: votes[keys[0]],
      [`reputation_vote_for_${keys[1]}`]: votes[keys[1]],
      [`reputation_vote_for_${keys[2]}`]: votes[keys[2]],
      is_sale: !!escrowObject.listingID
    });
    const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
    yield tr.set_required_fees();
    yield tr.add_signer(key.privKey, key.pubKey);
    yield tr.broadcast();
    yield put({ type: 'RETURN_ESCROW_TRANSACTION_SUCCEEDED', returnedTransaction: escrowObject });
  } catch (error) {
    console.log('ERROR RETURN', error);
    yield put({ type: 'RETURN_ESCROW_TRANSACTION_FAILED', error });
  }
}

function* updateEscrowSettings({ payload: { settings } }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const account = yield call(FetchChain, 'getAccount', currentUser.username);
    const tr = new TransactionBuilder();
    tr.add_type_operation('account_update', {
      account: account.get('id'),
      implicit_escrow_options: {
        positive_rating: settings.positiveRating,
        voted_witness: settings.transactionProcessor,
        active_witness: settings.activeTransactionProcessor
      }
    });
    const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
    yield tr.set_required_fees();
    yield tr.add_signer(key.privKey, key.pubKey);
    yield tr.broadcast();
    yield put(updateEscrowSettingsSucceeded(settings));
  } catch (error) {
    console.log('ERROR ', error);
    yield put(updateEscrowSettingsFailed(error));
  }
}

function* getMyEscrowSettings() {
  const { currentUser } = (yield select()).default.auth;
  const options = yield call(getEscrowSettingsService, currentUser.username);

  return options;
}

function* getEscrowSettings() {
  try {
    const options = yield getMyEscrowSettings();
    yield put(getEscrowSettingsSucceeded({
      positiveRating: options.positive_rating,
      transactionProcessor: options.voted_witness,
      activeTransactionProcessor: options.active_witness
    }));
  } catch (error) {
    console.log('ERROR ', error);
    yield put(getEscrowSettingsFailed(error));
  }
}

function* createEscrowExtendProposal({ payload: { escrowId, expirationTime }}) {
  try {
    console.log('EXPIRATION TIME ', expirationTime);
    const { currentUser } = (yield select()).default.auth;
    const escrow = yield call(getObjectById, escrowId);
    const [sec, feePayingAcc, sellerAcc, buyerAcc, escrowAcc] = yield Promise.all([
      TransactionBuilder.fetch_base_expiration_sec(),
      FetchChain('getAccount', currentUser.username),
      FetchChain('getAccount', escrow['seller']),
      FetchChain('getAccount', escrow['buyer']),
      FetchChain('getAccount', escrow['escrow'])
    ]);
    let tr = new TransactionBuilder();
    const escrowExtendOp = tr.get_type_operation(
      'escrow_extend_operation',
      {
        fee_paying_account: feePayingAcc.get('id'),
        escrow: escrowId,
        seller_account: sellerAcc.get('id'),
        buyer_account: buyerAcc.get('id'),
        escrow_account: escrowAcc.get('id'),
        expiration_time: sec + expirationTime
      }
    );
    tr.add_type_operation("proposal_create", {
      proposed_ops: [{op: escrowExtendOp}],
      fee_paying_account: feePayingAcc.get('id')
    });
    const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
    yield tr.set_required_fees();
    yield tr.add_signer(key.privKey, key.pubKey);
    yield tr.broadcast();
    yield put(createEscrowExtendProposalSucceeded());
  } catch (error) {
    console.log('ERROR ', error);
    yield put(createEscrowExtendProposalFailed(error));
  }
}

function* getEscrowProposals({payload: { accountIdOrName } }) {
  try {
    const account = yield ChainStore.fetchFullAccount(accountIdOrName);
    const proposals = (yield Promise.all(account.get('proposals').map(proposal => ChainStore.getObject(proposal))))
      .map(proposal => proposal.toJS());
    yield put(getEscrowProposalsSucceeded(proposals));
  } catch(error) {
    console.log("ERROR ", error);
    yield put(getEscrowProposalsFailed(error));
  }
}
