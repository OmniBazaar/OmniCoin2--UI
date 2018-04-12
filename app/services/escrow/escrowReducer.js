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
  loadMyEscrowAgents
} from './escrowActions';
import EscrowStorage from './escrowStorage';

const defaultState = {
  transactions: [],
  agents: [],
  myAgents: [],
  settings: null,
  error: null
};

const reducer = handleActions({
  [removeMyEscrowAgents](state, {payload: {agents}}) {
    return {
      ...state,
      myAgents: state.myAgents.filter(el => !agents.includes(el))
    }
  },
  [setMyEscrowAgents](state, {payload: {agents}}) {
    return {
      ...state,
      myAgents: agents
    }
  },
  [addOrUpdateAgents](state, {payload: {agents}}) {
    return {
      ...state,
      myAgents: unionBy(state.myAgents, agents, (el) => el.name)
    }
  },
  [getEscrowSettings](state) {
      return  {
        ...state,
        settings: EscrowStorage.getEscrowSettings()
      }
  },
  [updateEscrowSettings](state, {payload: {settings}}) {
    EscrowStorage.updateEscrowSettings(settings);
    return {
      ...state,
      settings: EscrowStorage.getEscrowSettings()
    }
  },
  [clearEscrowAgents](state) {
    return {
      ...state,
      agents: []
    }
  },
  [loadMyEscrowAgents](state) {
      return {
        ...state
      }
  },
  [loadEscrowAgents](state) {
    return {
      ...state
    }
  },
  LOAD_ESCROW_TRANSACTIONS_DONE: (state, action) => ({
    ...state,
    transactions: action.transactions
  }),
  LOAD_ESCROW_AGENTS_SUCCEEDED: (state, action) => ({
    ...state,
    agents: [
      ...state.agents,
      ...action.agents
    ],
    isAnythingLeft: action.isAnythingLeft
  }),
  LOAD_ESCROW_AGENTS_FAILED: (state, action) => ({
    ...state,
    error: action.error
  }),
  LOAD_MY_ESCROW_AGENTS_SUCCEEDED: (state, action) => ({
    ...state,
    myAgents: action.myAgents
  }),
  LOAD_MY_ESCROW_AGENTS_FAILED: (state, action) => ({
    ...state,
    error: action.error
  })

}, defaultState);

export default reducer;

