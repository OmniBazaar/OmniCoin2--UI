import { createActions } from 'redux-actions';

const {
  loadEscrowTransactions,
  loadEscrowAgents,
  loadMyEscrowAgents,
  addOrUpdateAgents,
  setMyEscrowAgents,
  removeMyEscrowAgents
} =
createActions({
  LOAD_ESCROW_TRANSACTIONS: (username) => ({ username }),
  LOAD_ESCROW_AGENTS: (username) => ({ username }),
  LOAD_MY_ESCROW_AGENTS: () => ({}),
  ADD_OR_UPDATE_AGENTS: (agents) => ({agents}),
  SET_MY_ESCROW_AGENTS: (agents) => ({agents}),
  REMOVE_MY_ESCROW_AGENTS: (agents) => ({agents})
});

export {
  loadEscrowTransactions,
  loadEscrowAgents,
  loadMyEscrowAgents,
  addOrUpdateAgents,
  setMyEscrowAgents,
  removeMyEscrowAgents
};
