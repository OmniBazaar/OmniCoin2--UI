import { handleActions, combineActions } from 'redux-actions';
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
  getEscrowAgentsCount
} from './escrowActions';
import EscrowStorage from './escrowStorage';

const defaultState = {
  transactions: [],
  agents: [],
  agentsCount: 0,
  myAgents: [],
  settings: null,
  error: null,
  loading: false
};

const reducer = handleActions({
  [removeMyEscrowAgents](state, { payload: { agents } }) {
    return {
      ...state,
      myAgents: state.myAgents.filter(el => !agents.includes(el))
    };
  },
  [setMyEscrowAgents](state, { payload: { agents } }) {
    return {
      ...state,
      myAgents: agents
    };
  },
  [addOrUpdateAgents](state, { payload: { agents } }) {
    return {
      ...state,
      myAgents: unionBy(state.myAgents, agents, (el) => el.name)
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
      agents: []
    };
  },
  [loadMyEscrowAgents](state) {
    return {
      ...state,
      loading: true
    };
  },
  [loadEscrowAgents](state) {
    return {
      ...state,
      loading: true
    };
  },
  [getEscrowAgentsCount](state) {
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
  GET_ESCROW_AGENTS_SUCCEEDED: (state, action) => ({
    ...state,
    agentsCount: action.count,
    loading: false
  }),
  GET_ESCROW_AGENTS_FAILED: (state, action) => ({
    ...state,
    error: action.error,
    loading: false
  })
}, defaultState);

export default reducer;

