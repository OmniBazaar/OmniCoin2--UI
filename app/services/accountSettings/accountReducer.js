import { handleActions, combineActions } from 'redux-actions';

import {
  setReferrer,
  setPublisher,
  setTransactionProcessor,
  setEscrow,
  changePriority,
  getRecentTransactions,
} from './accountActions';

const defaultState = {
  referrer: false,
  publisher: false,
  transactionProcessor: false,
  escrow: false,
  priority: 'local',
  recentTransactions: [],
  recentTransactionsFiltered: [],
  sortDirection: 'descending',
  sortColumn: 'rank',
  activePage: 1,
  totalPages: 1,
  rowsPerPage: 10,
  filterTextTop: '',
};

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => (
  Math.ceil(data.length / rowsPerPage)
);

const reducer = handleActions({
  [combineActions(setReferrer)](state, { payload: { referrer } }) {
    return {
      ...state,
      referrer: !state.referrer,
    };
  },
  [combineActions(setPublisher)](state, { payload: { publisher } }) {
    return {
      ...state,
      publisher: !state.publisher,
    };
  },
  [combineActions(setTransactionProcessor)](state, { payload: { transactionProcessor } }) {
    return {
      ...state,
      transactionProcessor: !state.transactionProcessor,
    };
  },
  [combineActions(setEscrow)](state, { payload: { escrow } }) {
    return {
      ...state,
      escrow: !state.escrow,
    };
  },
  [combineActions(changePriority)](state, { payload: { priority } }) {
    return {
      ...state,
      priority
    };
  },
  [combineActions(getRecentTransactions)](state, { payload: { recentTransactions } }) {
    return {
      ...state,
      recentTransactions,
      recentTransactionsFiltered: recentTransactions,
    };
  },
}, defaultState);

export default reducer;
