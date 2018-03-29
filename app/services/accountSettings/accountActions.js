import { createActions } from 'redux-actions';

const {
  setReferrer,
  setPublisher,
  setTransactionProcessor,
  setEscrow,
  changePriority,
  getRecentTransactions,
  setActivePage,
  setPagination,
  sortData,
  filterData,
  showDetailsModal,
  setRescan,
  getVotes,
  sortVotesData,
  updatePublicData,
  getPrivateData,
  updatePrivateData
} = createActions({
  SET_REFERRER: () => ({}),
  SET_PUBLISHER: () => ({}),
  SET_TRANSACTION_PROCESSOR: () => ({}),
  SET_ESCROW: () => ({}),
  CHANGE_PRIORITY: (priority) => ({ priority }),
  GET_RECENT_TRANSACTIONS: (recentTransactions) => ({ recentTransactions }),
  SET_ACTIVE_PAGE: (activePage) => ({ activePage }),
  SET_PAGINATION: (rowsPerPage) => ({ rowsPerPage }),
  SORT_DATA: (sortColumn) => ({ sortColumn }),
  FILTER_DATA: (filterText) => ({ filterText }),
  SHOW_DETAILS_MODAL: (detailSelected) => ({ detailSelected }),
  SET_RESCAN: () => ({}),
  GET_VOTES: (votes) => ({ votes }),
  SORT_VOTES_DATA: (sortVoteColumn) => ({ sortVoteColumn }),
  UPDATE_PUBLIC_DATA: () => ({}),
  GET_PRIVATE_DATA: () => ({}),
  UPDATE_PRIVATE_DATA: (data) => ({ data })
});

export {
  setReferrer,
  setPublisher,
  setTransactionProcessor,
  setEscrow,
  changePriority,
  getRecentTransactions,
  setActivePage,
  setPagination,
  sortData,
  filterData,
  showDetailsModal,
  setRescan,
  getVotes,
  sortVotesData,
  updatePublicData,
  getPrivateData,
  updatePrivateData
};
