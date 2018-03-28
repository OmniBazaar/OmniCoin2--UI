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
  updatePublicData,
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
  [setReferrer](state) {
    return {
      ...state,
      referrer: !state.referrer,
    };
  },
  [setPublisher](state) {
    return {
      ...state,
      publisher: !state.publisher,
    };
  },
  [setTransactionProcessor](state) {
    return {
      ...state,
      transactionProcessor: !state.transactionProcessor,
    };
  },
  [setEscrow](state) {
    return {
      ...state,
      escrow: !state.escrow,
    };
  },
  [changePriority](state, { payload: { priority } }) {
    return {
      ...state,
      priority
    };
  },
  [showDetailsModal](state, { payload: { detailSelected } }) {
    return {
      ...state,
      showDetails: !state.showDetails,
      detailSelected,
    };
  },
  [updatePublicData](state, { payload: { }}) {
    return {
      ...state,
    }
  },
  [setRescan](state) {
    return {
      ...state,
      rescanBlockchain: !state.rescanBlockchain,
    };
  },
  [getRecentTransactions](state, { payload: { recentTransactions } }) {
    return {
      ...state,
      recentTransactions,
      recentTransactionsFiltered: recentTransactions,
    };
  },

  [filterData](state, { payload: { filterText } }) {
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
  [setPagination](state, { payload: { rowsPerPage } }) {
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
  [setActivePage](state, { payload: { activePage } }) {
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
  [sortData](state, { payload: { sortColumn } }) {
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
  [getVotes](state, { payload: { votes } }) {
    return {
      ...state,
      votes,
      votesFiltered: votes,
    };
  },
  [sortVotesData](state, { payload: { sortVoteColumn } }) {
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
