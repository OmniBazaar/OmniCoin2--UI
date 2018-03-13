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
  setRescan
} = createActions({
  SET_REFERRER: (referrer) => ({ referrer }),
  SET_PUBLISHER: (publisher) => ({ publisher }),
  SET_TRANSACTION_PROCESSOR: (transactionProcessor) => ({ transactionProcessor }),
  SET_ESCROW: (escrow) => ({ escrow }),
  CHANGE_PRIORITY: (priority) => ({ priority }),
  GET_RECENT_TRANSACTIONS: (recentTransactions) => ({ recentTransactions }),
  SET_ACTIVE_PAGE: (activePage) => ({ activePage }),
  SET_PAGINATION: (rowsPerPage) => ({ rowsPerPage }),
  SORT_DATA: (sortColumn) => ({ sortColumn }),
  FILTER_DATA: (filterText) => ({ filterText }),
  SHOW_DETAILS_MODAL: (detailSelected) => ({ detailSelected }),
  SET_RESCAN: (rescanBlockchain) => ({ rescanBlockchain }),
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
  setRescan
};
