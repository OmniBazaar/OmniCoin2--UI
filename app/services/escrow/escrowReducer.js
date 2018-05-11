import { handleActions } from 'redux-actions';
import { unionBy } from 'lodash';
import {
  loadEscrowTransactions,
  loadEscrowAgents,
  addOrUpdateAgents,
  setMyEscrowAgents,
  removeMyEscrowAgents,
  getEscrowSettings,
  updateEscrowSettings,
  clearEscrowAgents,
  loadMyEscrowAgents,
  getEscrowAgentsCount,
  releaseEscrowTransaction,
  returnEscrowTransaction
} from './escrowActions';
import EscrowStorage from './escrowStorage';

const defaultState = {
  transactions: [],
  agents: [],
  agentsCount: 0,
  myAgents: [],
  settings: null,
  releasedTransaction: null,
  returnedTransaction: null,
  error: null,
  loading: false,
  updating: false,
  finalizing: false
};

const reducer = handleActions(
  {
    [removeMyEscrowAgents](state, { payload: { agents } }) {
      return {
        ...state,
        myAgents: state.myAgents.filter(el => !agents.find(agent => agent.id === el.id))
      };
    },
    [setMyEscrowAgents](state, { payload: { agents } }) {
      return {
        ...state,
        error: null,
        myAgents: agents,
        updating: true
      };
    },
    SET_MY_ESCROW_AGENTS_SUCCEEDED: (state) => ({
      ...state,
      updating: false
    }),
    SET_MY_ESCROW_AGENTS_FAILED: (state, action) => ({
      ...state,
      error: action.error,
      updating: false
    }),
    [addOrUpdateAgents](state, { payload: { agents } }) {
      return {
        ...state,
        myAgents: unionBy(state.myAgents, agents, (el) => el.id)
      };
    },
    [getEscrowSettings](state) {
      return {
        ...state,
        settings: EscrowStorage.getEscrowSettings()
      };
    },
    [updateEscrowSettings](state, { payload: { settings } }) {
      EscrowStorage.updateEscrowSettings(settings);
      return {
        ...state,
        settings: EscrowStorage.getEscrowSettings()
      };
    },
    [clearEscrowAgents](state) {
      return {
        ...state,
        agents: [],
        myAgents: []
      };
    },
    [loadMyEscrowAgents](state) {
      return {
        ...state,
        error: null,
        loading: true
      };
    },
    LOAD_MY_ESCROW_AGENTS_SUCCEEDED: (state, action) => ({
      ...state,
      myAgents: action.myAgents,
      loading: false
    }),
    LOAD_MY_ESCROW_AGENTS_FAILED: (state, action) => ({
      ...state,
      error: action.error,
      loading: false
    }),
    [loadEscrowAgents](state) {
      return {
        ...state,
        error: null,
        loading: true
      };
    },
    LOAD_ESCROW_AGENTS_SUCCEEDED: (state, action) => ({
      ...state,
      agents: action.agents,
      loading: false
    }),
    LOAD_ESCROW_AGENTS_FAILED: (state, action) => ({
      ...state,
      error: action.error,
      loading: false
    }),
    [getEscrowAgentsCount](state) {
      return {
        ...state,
        error: null,
        loading: true
      };
    },
    GET_ESCROW_AGENTS_COUNT_SUCCEEDED: (state, action) => ({
      ...state,
      agentsCount: action.count,
      loading: false
    }),
    GET_ESCROW_AGENTS_COUNT_FAILED: (state, action) => ({
      ...state,
      error: action.error,
      loading: false
    }),
    [loadEscrowTransactions](state) {
      return {
        ...state,
        loading: true
      };
    },
    LOAD_ESCROW_TRANSACTIONS_DONE: (state, action) => ({
      ...state,
      transactions: action.transactions,
      loading: false
    }),
    LOAD_ESCROW_TRANSACTIONS_FAILED: (state, action) => ({
      ...state,
      error: action.error,
      loading: false
    }),
    [releaseEscrowTransaction](state) {
      return {
        ...state,
        finalizing: true,
        error: null,
        releasedTransaction: null,
        returnedTransaction: null
      };
    },
    RELEASE_ESCROW_TRANSACTION_SUCCEEDED: (state, { releasedTransaction }) => ({
      ...state,
      releasedTransaction,
      transactions: state.transactions.filter(el => el.transactionID !== releasedTransaction.transactionID),
      finalizing: false
    }),
    RELEASE_ESCROW_TRANSACTION_FAILED: (state, { error }) => ({
      ...state,
      finalizing: false,
      error
    }),
    [returnEscrowTransaction](state) {
      return {
        ...state,
        finalizing: true,
        error: null,
        releasedTransaction: null,
        returnedTransaction: null
      };
    },
    RETURN_ESCROW_TRANSACTION_SUCCEEDED: (state, { returnedTransaction }) => ({
      ...state,
      returnedTransaction,
      transactions: state.transactions.filter(el => el.transactionID !== returnedTransaction.transactionID),
      finalizing: false
    }),
    RETURN_ESCROW_TRANSACTION_FAILED: (state, { error }) => ({
      ...state,
      finalizing: false,
      error
    }),
  }
  , defaultState
);

export default reducer;

