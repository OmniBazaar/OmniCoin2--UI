import { createActions } from 'redux-actions';

const {
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
} =
createActions({
  LOAD_ESCROW_TRANSACTIONS: (username) => ({ username }),
  LOAD_ESCROW_AGENTS: (start, limit, searchTerm) => ({ start, limit, searchTerm }),
  ADD_OR_UPDATE_AGENTS: (agents) => ({ agents }),
  SET_MY_ESCROW_AGENTS: (agents) => ({ agents }),
  REMOVE_MY_ESCROW_AGENTS: (agents) => ({ agents }),
  GET_ESCROW_SETTINGS: (settings) => ({ settings }),
  UPDATE_ESCROW_SETTINGS: (settings) => ({ settings }),
  CLEAR_ESCROW_AGENTS: () => ({}),
  LOAD_MY_ESCROW_AGENTS: (username) => ({ username }),
  GET_ESCROW_AGENTS_COUNT: () => ({})
});

export {
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
};
