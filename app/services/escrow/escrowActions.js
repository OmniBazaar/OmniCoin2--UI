import { createActions } from 'redux-actions';

const {
  loadEscrowTransactions,
  loadEscrowAgents,
  addOrUpdateAgents,
  setMyEscrowAgents,
  removeMyEscrowAgents,
  getEscrowSettings,
  getEscrowSettingsSucceeded,
  getEscrowSettingsFailed,
  updateEscrowSettings,
  updateEscrowSettingsSucceeded,
  updateEscrowSettingsFailed,
  clearEscrowAgents,
  loadMyEscrowAgents,
  getEscrowAgentsCount,
  releaseEscrowTransaction,
  returnEscrowTransaction,
  setActivePageMyEscrow,
  setPaginationMyEscrow
} =
createActions({
  LOAD_ESCROW_TRANSACTIONS: (username) => ({ username }),
  LOAD_ESCROW_AGENTS: (start, limit, searchTerm, filters) => ({
    start, limit, searchTerm, filters
  }),
  ADD_OR_UPDATE_AGENTS: (agents) => ({ agents }),
  SET_MY_ESCROW_AGENTS: (agents) => ({ agents }),
  REMOVE_MY_ESCROW_AGENTS: (agents) => ({ agents }),
  GET_ESCROW_SETTINGS: () => ({ }),
  GET_ESCROW_SETTINGS_SUCCEEDED: (settings) => ({ settings }),
  GET_ESCROW_SETTINGS_FAILED: (error) => ({ error }),
  UPDATE_ESCROW_SETTINGS: (settings) => ({ settings }),
  UPDATE_ESCROW_SETTINGS_SUCCEEDED: (settings) => ({ settings }),
  UPDATE_ESCROW_SETTINGS_FAILED: (error) => ({ error }),
  CLEAR_ESCROW_AGENTS: () => ({}),
  LOAD_MY_ESCROW_AGENTS: () => ({}),
  GET_ESCROW_AGENTS_COUNT: () => ({}),
  RELEASE_ESCROW_TRANSACTION: (escrowObject, votes) => ({ escrowObject, votes }),
  RETURN_ESCROW_TRANSACTION: (escrowObject, votes) => ({ escrowObject, votes }),
  SET_PAGINATION_MY_ESCROW: (rowsPerPageMyEscrow) => ({ rowsPerPageMyEscrow }),
  SET_ACTIVE_PAGE_MY_ESCROW: (activePageMyEscrow) => ({ activePageMyEscrow })
});

export {
  loadEscrowTransactions,
  loadEscrowAgents,
  addOrUpdateAgents,
  setMyEscrowAgents,
  removeMyEscrowAgents,
  getEscrowSettings,
  getEscrowSettingsSucceeded,
  getEscrowSettingsFailed,
  updateEscrowSettingsSucceeded,
  updateEscrowSettingsFailed,
  updateEscrowSettings,
  clearEscrowAgents,
  loadMyEscrowAgents,
  getEscrowAgentsCount,
  releaseEscrowTransaction,
  returnEscrowTransaction,
  setActivePageMyEscrow,
  setPaginationMyEscrow
};
