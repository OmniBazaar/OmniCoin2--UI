import { createActions } from 'redux-actions';

const {
  setReferrer,
  setPublisher,
  setTransactionProcessor,
  setEscrow,
  changePriority,
  changeCountry,
  changeCity,
  changeCategory,
  changePublisherName,
  changeKeywords,
  changeSearchPriorityData,
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
  updatePrivateData,
  getPublisherData,
  updatePublisherData,
  getPublishers,
  changeIpAddress
} = createActions({
  SET_REFERRER: () => ({}),
  SET_PUBLISHER: () => ({}),
  SET_TRANSACTION_PROCESSOR: () => ({}),
  SET_ESCROW: () => ({}),
  CHANGE_PRIORITY: (priority) => ({ priority }),
  CHANGE_COUNTRY: (country) => ({ country }),
  CHANGE_CITY: (city) => ({ city }),
  CHANGE_CATEGORY: (category) => ({ category }),
  CHANGE_PUBLISHER_NAME: (publisher) => ({ publisher }),
  CHANGE_KEYWORDS: (keywords) => ({ keywords }),
  CHANGE_SEARCH_PRIORITY_DATA: (data) => ({ data }),
  GET_RECENT_TRANSACTIONS: () => ({ }),
  SET_ACTIVE_PAGE: (activePage) => ({ activePage }),
  SET_PAGINATION: (rowsPerPage) => ({ rowsPerPage }),
  SORT_DATA: (sortColumn, direction) => ({ sortColumn, direction }),
  FILTER_DATA: (filterText) => ({ filterText }),
  SHOW_DETAILS_MODAL: (detailSelected) => ({ detailSelected }),
  SET_RESCAN: () => ({}),
  GET_VOTES: (votes) => ({ votes }),
  SORT_VOTES_DATA: (sortVoteColumn) => ({ sortVoteColumn }),
  UPDATE_PUBLIC_DATA: () => ({}),
  GET_PRIVATE_DATA: () => ({}),
  UPDATE_PRIVATE_DATA: (data) => ({ data }),
  GET_PUBLISHER_DATA: () => ({}),
  UPDATE_PUBLISHER_DATA: (data) => ({ data }),
  GET_PUBLISHERS: () => ({}),
  CHANGE_IP_ADDRESS: (ip) => ({ ip })
});

export {
  setReferrer,
  setPublisher,
  setTransactionProcessor,
  setEscrow,
  changePriority,
  changeCountry,
  changeCity,
  changeCategory,
  changePublisherName,
  changeKeywords,
  changeSearchPriorityData,
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
  updatePrivateData,
  getPublisherData,
  updatePublisherData,
  getPublishers,
  changeIpAddress
};
