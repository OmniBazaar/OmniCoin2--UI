import { handleActions } from 'redux-actions';
import { unionBy } from 'lodash';
import {
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
  setPaginationMyEscrow,
  createEscrowExtendProposal,
  createEscrowExtendProposalSucceeded,
  createEscrowExtendProposalFailed,
  approveEscrowExtendProposal,
  approveEscrowExtendProposalSucceeded,
  approveEscrowExtendProposalFailed,
  getEscrowProposals,
  getEscrowProposalsFailed,
  getEscrowProposalsSucceeded
} from './escrowActions';

const defaultState = {
  transactions: [],
  transactionsFiltered: [],
  agents: [],
  agentsCount: 0,
  myAgents: [],
  settings: null,
  releasedTransaction: null,
  returnedTransaction: null,
  error: null,
  myEscrowError: null,
  loading: false,
  myEscrowLoading: false,
  updating: false,
  updatingSettings: false,
  finalizing: false,
  activePageMyEscrow: 1,
  rowsPerPageMyEscrow: 20,
  totalPagesMyEscrow: 1,
  escrowExtendProposal: {
    loading: false,
    error: null
  },
  activeEscrowProposals: {
    proposals: [],
    loading: false,
    error: null,
    proposalApprove: {
      proposalId: null,
      loading: false,
      error: null
    }
  }
};

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => (
  Math.ceil(data.length / rowsPerPage)
);

const reducer = handleActions(
  {
    [createEscrowExtendProposal](state) {
      return {
        ...state,
        escrowExtendProposal: {
          loading: true,
          error: null
        }
      }
    },
    [createEscrowExtendProposalSucceeded](state) {
      return {
        ...state,
        escrowExtendProposal: {
          ...state.escrowExtendProposal,
          loading: false,
        }
      }
    },
    [createEscrowExtendProposalFailed](state, { payload: { error } }) {
      return {
        ...state,
        escrowExtendProposal: {
          loading: false,
          error
        }
      }
    },
    [approveEscrowExtendProposal](state, { payload: { proposalId } }) {
      return {
        ...state,
        activeEscrowProposals: {
          ...state.activeEscrowProposals,
          proposalApprove: {
            proposalId,
            loading: true,
            error: null
          }
        }
      }
    },
    [approveEscrowExtendProposalSucceeded](state) {
      return {
        ...state,
        activeEscrowProposals: {
          ...state.activeEscrowProposals,
          proposalApprove: {
            ...state.activeEscrowProposals.proposalApprove,
            loading: false
          }
        }
      }
    },
    [approveEscrowExtendProposalFailed](state, { payload: { error } }) {
      return {
        ...state,
        activeEscrowProposals: {
          ...state.activeEscrowProposals,
          proposalApprove: {
            ...state.activeEscrowProposals.proposalApprove,
            loading: false,
            error
          }
        }
      }
    },
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
        loading: true,
        error: null
      };
    },
    [getEscrowSettingsSucceeded](state, { payload: { settings } }) {
      console.log('SETTINGS ', settings);
      return {
        ...state,
        settings,
        loading: false,
      };
    },
    [getEscrowSettingsFailed](state, { payload: { error } }) {
      return {
        ...state,
        loading: false,
        error
      };
    },
    [updateEscrowSettings](state) {
      return {
        ...state,
        updatingSettings: true,
        error: null
      };
    },
    [updateEscrowSettingsSucceeded](state, { payload: { settings } }) {
      return {
        ...state,
        settings,
        updatingSettings: false,
      };
    },
    [updateEscrowSettingsFailed](state, { payload: { error } }) {
      return {
        ...state,
        error,
        updatingSettings: false
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
        myEscrowError: null,
        myEscrowLoading: true
      };
    },
    LOAD_MY_ESCROW_AGENTS_SUCCEEDED: (state, action) => ({
      ...state,
      myAgents: action.myAgents,
      myEscrowLoading: false
    }),
    LOAD_MY_ESCROW_AGENTS_FAILED: (state, action) => ({
      ...state,
      myEscrowError: action.error,
      myEscrowLoading: false
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
      transactionsFiltered: action.transactions,
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
      transactionsFiltered: state.transactions.filter(el => el.transactionID !== releasedTransaction.transactionID),
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
      transactionsFiltered: state.transactions.filter(el => el.transactionID !== returnedTransaction.transactionID),
      finalizing: false
    }),
    RETURN_ESCROW_TRANSACTION_FAILED: (state, { error }) => ({
      ...state,
      finalizing: false,
      error
    }),
    [setPaginationMyEscrow](state, { payload: { rowsPerPageMyEscrow } }) {
      const data = state.transactions;
      const { activePageMyEscrow } = state;
      const totalPagesMyEscrow = getTotalPages(data, rowsPerPageMyEscrow);
      const currentData = sliceData(data, activePageMyEscrow, rowsPerPageMyEscrow);

      return {
        ...state,
        totalPagesMyEscrow,
        rowsPerPageMyEscrow,
        transactionsFiltered: currentData,
      };
    },
    [setActivePageMyEscrow](state, { payload: { activePageMyEscrow } }) {
      const data = state.transactions;
      if (activePageMyEscrow !== state.activePageStandBy) {
        const { rowsPerPageMyEscrow } = state;
        const currentData = sliceData(data, activePageMyEscrow, rowsPerPageMyEscrow);

        return {
          ...state,
          activePageMyEscrow,
          transactionsFiltered: currentData,
        };
      }

      return {
        ...state,
      };
    },
    [getEscrowProposals](state) {
      return {
        ...state,
        activeEscrowProposals: {
          ...state.activeEscrowProposals,
          loading: true,
          error: null
        }
      }
    },
    [getEscrowProposalsSucceeded](state, { payload: { proposals } }) {
      return {
        ...state,
        activeEscrowProposals: {
          ...state.activeEscrowProposals,
          proposals,
          loading: false,
          error: null
        }
      }
    },
    [getEscrowProposalsFailed](state, { payload: { error }}) {
      return {
        ...state,
        activeEscrowProposals: {
          ...state.active.proposals,
          loading: false,
          error
        }
      }
    }
  }
  , defaultState
);

export default reducer;

