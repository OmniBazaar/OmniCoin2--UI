import { handleActions, combineActions } from 'redux-actions';

import {
  loadEscrowTransactions,
  loadMyEscrowAgents,
  addOrUpdateAgents,
  setMyEscrowAgents,
  removeMyEscrowAgents
} from './escrowActions';
import EscrowStorage from './escrowStorage';

const defaultState = {
  transactions: {},
  agents: {},
  myAgents: [],
  escrowSettings: {

  }
};

const reducer = handleActions({
  [removeMyEscrowAgents](state, {payload: {agents}}) {
    return {
      ...state,
      myAgents: EscrowStorage.removeAgents(agents)
    }
  },
  [setMyEscrowAgents](state, {payload: {agents}}) {
    EscrowStorage.setSelectedAgents(agents);
    return {
      ...state,
      myAgents: agents
    }
  },
  [loadMyEscrowAgents](state) {
    return {
      ...state,
      myAgents: EscrowStorage.getSelectedAgents()
    }
  },
  [addOrUpdateAgents](state, {payload: {agents}}) {
    const myAgents = EscrowStorage.addOrUpdateAgents(agents);
    return {
      ...state,
      myAgents
    }
  },
  LOAD_ESCROW_TRANSACTIONS_DONE: (state, action) => ({
    ...state,
    transactions: action.transactions
  }),

  LOAD_ESCROW_AGENTS_DONE: (state, action) => ({
    ...state,
    agents: action.agents
  })

}, defaultState);

export default reducer;

