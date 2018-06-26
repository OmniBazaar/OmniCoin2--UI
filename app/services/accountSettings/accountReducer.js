import { handleActions } from 'redux-actions';
import _ from 'lodash';

import PriorityTypes from '../../common/SearchPriorityType';

import AccountSettingsStorage from './accountStorage';
import {
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
  getPrivateData,
  updatePrivateData,
  getPublisherData,
  updatePublisherData,
  getPublishers,
  changeIpAddress,
  changeSearchPriorityData
} from './accountActions';

const defaultPublisherData = {
  priority: 'local',
  country: '',
  city: '',
  category: '',
  publisherName: '',
  keywords: []
};

const defaultState = {
  referrer: true,
  publisher: false,
  transactionProcessor: false,
  escrow: false,
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
  loading: false,
  error: null,
  privateData: {
    firstname: '',
    lastname: '',
    email: '',
    website: ''
  },
  publisherData: {
    priority: 'local',
    country: '',
    city: '',
    category: '',
    publisherName: '',
    keywords: []
  },
  publishers: {
    publishers: [],
    loading: false,
    error: null
  },
  ipAddress: ''
};

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => (
  Math.ceil(data.length / rowsPerPage)
);

const savePublisherData = data => {
  let newData = {
    ...data
  };

  switch (newData.priority) {
    case PriorityTypes.LOCAL_DATA:
      newData = {
        keywords: [],
        publisherName: ''
      };
      break;
    case PriorityTypes.BY_CATEGORY:
      newData = {
        country: '',
        city: '',
        publisherName: ''
      };
      break;
    case PriorityTypes.PUBLISHER:
      newData = {
        country: '',
        city: '',
        keywords: []
      };
      break;
  }

  data = {
    ...data,
    ...newData
  };
  AccountSettingsStorage.updatePublisherData(data);

  return data;
};

const reducer = handleActions({
  [setReferrer](state) {
    return {
      ...state,
      referrer: true,
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
      publisherData: {
        ...state.publisherData,
        priority
      }
    };
  },
  [changeCountry](state, { payload: { country } }) {
    return {
      ...state,
      publisherData: {
        ...state.publisherData,
        country
      }
    };
  },
  [changeCity](state, { payload: { city } }) {
    return {
      ...state,
      publisherData: {
        ...state.publisherData,
        city
      }
    };
  },
  [changeCategory](state, { payload: { category } }) {
    return {
      ...state,
      publisherData: {
        ...state.publisherData,
        category
      }
    };
  },
  [changePublisherName](state, { payload: { publisher } }) {
    return {
      ...state,
      publisherData: {
        ...state.publisherData,
        publisherName: publisher
      }
    };
  },
  [changeKeywords](state, { payload: { keywords } }) {
    return {
      ...state,
      publisherData: {
        ...state.publisherData,
        keywords: keywords || []
      }
    };
  },
  [changeSearchPriorityData](state, { payload: { data } }) {
    const publisherData = {
      ...state.publisherData,
      ...data
    };
    const newData = savePublisherData(publisherData);
    return {
      ...state,
      publisherData: newData
    };
  },
  [showDetailsModal](state, { payload: { detailSelected } }) {
    return {
      ...state,
      showDetails: !state.showDetails,
      detailSelected,
    };
  },
  [getPrivateData](state) {
    const data = AccountSettingsStorage.getPrivateData();
    return {
      ...state,
      privateData: {
        ...state.privateData,
        ...data
      },
    };
  },
  [updatePrivateData](state, { payload: { data } }) {
    const privateData = {
      ...state.privateData,
      ...data
    };

    AccountSettingsStorage.updatePrivateData(privateData);
    return {
      ...state,
      privateData
    };
  },
  [getPublisherData](state) {
    const data = AccountSettingsStorage.getPublisherData();
    return {
      ...state,
      publisherData: {
        ...state.publisherData,
        ...data
      }
    };
  },
  [updatePublisherData](state, { payload: { data } }) {
    const copiedData = { ...data };

    if (!data.country) {
      copiedData.city = '';
    }

    const publisherData = {
      ...state.publisherData,
      ...copiedData,
    };

    const newData = savePublisherData(publisherData);

    return {
      ...state,
      publisherData: newData
    };
  },
  [updatePublicData](state) {
    return {
      ...state,
      loading: true,
      error: null
    };
  },
  UPDATE_PUBLIC_DATA_SUCCEEDED: (state) => ({
    ...state,
    loading: false,
    error: null
  }),
  UPDATE_PUBLIC_DATA_FAILED: (state, { error }) => ({
    ...state,
    loading: false,
    error
  }),
  [getPublishers](state) {
    return {
      ...state,
      publishers: {
        ...state.publishers,
        loading: true
      }
    };
  },
  GET_PUBLISHERS_SUCCEEDED: (state, { publishers }) => ({
    ...state,
    publishers: {
      publishers,
      loading: false,
      error: null
    }
  }),
  GET_PUBLISHERS_FAILED: (state, { error }) => ({
    ...state,
    publishers: {
      publishers: [],
      loading: false,
      error
    }
  }),
  [setRescan](state) {
    return {
      ...state,
      rescanBlockchain: !state.rescanBlockchain,
    };
  },
  [getRecentTransactions](state) {
    return {
      ...state,
      loading: true,
      error: null
    };
  },
  GET_RECENT_TRANSACTIONS_SUCCEEDED: (state, { transactions }) => ({
    ...state,
    loading: false,
    error: null,
    recentTransactions: transactions,
  }),
  GET_RECENT_TRANSACTIONS_FAILED: (state, { error }) => ({
    ...state,
    loading: false,
    error
  }),
  [filterData](state, { payload: { filterText } }) {
    const activePage = 1;
    const { rowsPerPage } = state;
    let filteredData = state.recentTransactions;
    if (filterText) {
      filteredData = filteredData.filter(el => JSON.stringify(el).indexOf(filterText) !== -1)
    }
    const totalPages = getTotalPages(filteredData, rowsPerPage);
    const currentData = sliceData(filteredData, activePage, rowsPerPage);
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
    let data = state.recentTransactions;
    if (!!filterText) {
      data = data.filter(el => JSON.stringify(el).indexOf(filterText) !== -1)
    }
    const sortedData = _.orderBy(data, [sortColumn], [sortDirection === 'ascending' ? 'asc' : 'desc']);
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
  [changeIpAddress](state, { payload: { ip } }) {
    return {
      ...state,
      ipAddress: ip
    };
  }
}, defaultState);

export default reducer;
