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
  loadMyEscrowAgents
} =
createActions({
  LOAD_ESCROW_TRANSACTIONS: (username) => ({ username }),
  LOAD_ESCROW_AGENTS: (start, limit, search_term) => ({start, limit, search_term}),
  ADD_OR_UPDATE_AGENTS: (agents) => ({agents}),
  SET_MY_ESCROW_AGENTS: (agents) => ({agents}),
  REMOVE_MY_ESCROW_AGENTS: (agents) => ({agents}),
  GET_ESCROW_SETTINGS: (settings) => ({settings}),
  UPDATE_ESCROW_SETTINGS: (settings) => ({settings}),
  CLEAR_ESCROW_AGENTS: () => ({}),
  LOAD_MY_ESCROW_AGENTS: (username) => ({username})
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
  loadMyEscrowAgents
};
