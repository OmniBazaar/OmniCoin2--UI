import { handleActions, combineActions } from 'redux-actions';
import _ from 'lodash';

import {
  setReferrer,
  setPublisher,
  setTransactionProcessor,
  setEscrow,
  changePriority,
  getRecentTransactions,
  setActivePage,
  filterData,
  setPagination,
  sortData,
  showDetailsModal,
  setRescan,
  getVotes,
  sortVotesData,
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
  sortColumn: 'date',
  activePage: 1,
  totalPages: 1,
  rowsPerPage: 10,
  filterText: '',
  showDetails: false,
  detailSelected: {},
  rescanBlockchain: false,
  votes: [],
  votesFiltered: [],
  sortVoteDirection: 'descending',
  sortVoteColumn: 'processor',
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
  [combineActions(showDetailsModal)](state, { payload: { detailSelected } }) {
    return {
      ...state,
      showDetails: !state.showDetails,
      detailSelected,
    };
  },
  [combineActions(setRescan)](state, { payload: { rescanBlockchain } }) {
    return {
      ...state,
      rescanBlockchain: !state.rescanBlockchain,
    };
  },
  [combineActions(getRecentTransactions)](state, { payload: { recentTransactions } }) {
    return {
      ...state,
      recentTransactions,
      recentTransactionsFiltered: recentTransactions,
    };
  },
  [combineActions(filterData)](state, { payload: { filterText } }) {
    const data = state.recentTransactions;
    const activePage = 1;
    let { totalPages } = state;
    const { rowsPerPage } = state;
    let currentData = [];

    if (filterText !== '') {
      let filteredData = _.map(data, (o) => {
        const values = Object.values(o);
        const result = _.map(values, (val) => {
          if (val) {
            if (val.toString().indexOf(filterText) !== -1) return o;
          }
        });
        return _.without(result, undefined)[0];
      });

      filteredData = _.without(filteredData, undefined);
      totalPages = getTotalPages(filteredData, rowsPerPage);
      currentData = sliceData(filteredData, activePage, rowsPerPage);
    } else {
      currentData = data;
      totalPages = getTotalPages(currentData, rowsPerPage);
      currentData = sliceData(currentData, activePage, rowsPerPage);
    }

    return {
      ...state,
      filterText,
      activePage,
      totalPages,
      recentTransactionsFiltered: currentData,
    };
  },
  [combineActions(setPagination)](state, { payload: { rowsPerPage } }) {
    const data = state.recentTransactions;
    const { activePage } = state;
    const totalPages = getTotalPages(data, rowsPerPage);
    const currentData = sliceData(data, activePage, rowsPerPage);

    return {
      ...state,
      totalPages,
      rowsPerPage,
      recentTransactionsFiltered: currentData,
    };
  },
  [combineActions(setActivePage)](state, { payload: { activePage } }) {
    const data = state.recentTransactions;
    if (activePage !== state.activePage) {
      const { rowsPerPage } = state;
      const currentData = sliceData(data, activePage, rowsPerPage);

      return {
        ...state,
        activePage,
        recentTransactionsFiltered: currentData,
      };
    }

    return {
      ...state,
    };
  },
  [combineActions(sortData)](state, { payload: { sortColumn } }) {
    const { filterText } = state;
    let sortDirection = state.sortDirection === 'ascending' ? 'descending' : 'ascending';
    const sortByFilter = _.sortBy(state.recentTransactionsFiltered, [sortColumn]);
    const sortByData = _.sortBy(state.recentTransactions, [sortColumn]);
    const sortBy = filterText !== '' ? sortByFilter : sortByData;
    let sortedData = [];

    if (state.sortColumn !== sortColumn) {
      sortedData = sortBy.reverse();
      sortDirection = 'ascending';
    } else {
      sortedData = sortDirection === 'ascending' ? sortBy.reverse() : sortBy;
    }

    const { activePage, rowsPerPage } = state;
    const currentData = sliceData(sortedData, activePage, rowsPerPage);

    return {
      ...state,
      recentTransactionsFiltered: currentData,
      sortDirection,
      sortColumn,
    };
  },
  [combineActions(getVotes)](state, { payload: { votes } }) {
    console.log('here', votes);
    return {
      ...state,
      votes,
      votesFiltered: votes,
    };
  },
  [combineActions(sortVotesData)](state, { payload: { sortVoteColumn } }) {
    let sortVoteDirection = state.sortVoteDirection === 'ascending' ? 'descending' : 'ascending';
    const sortBy = _.sortBy(state.votes, [sortVoteColumn]);
    let sortedData = [];

    if (state.sortVoteColumn !== sortVoteColumn) {
      sortedData = sortBy.reverse();
      sortVoteDirection = 'ascending';
    } else {
      sortedData = sortVoteDirection === 'ascending' ? sortBy.reverse() : sortBy;
    }

    const { activePage, rowsPerPage } = state;
    const currentData = sliceData(sortedData, activePage, rowsPerPage);

    return {
      ...state,
      votesFiltered: currentData,
      sortVoteDirection,
      sortVoteColumn,
    };
  },
}, defaultState);

export default reducer;
