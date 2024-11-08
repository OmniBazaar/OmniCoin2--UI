import { handleActions } from 'redux-actions';
import _ from 'lodash';
import { ChainTypes } from 'omnibazaarjs/es';
import dateformat from 'dateformat';

import PriorityTypes from '../../common/SearchPriorityType';

import AccountSettingsStorage from './accountStorage';
import {
  setReferrer,
  setPublisher,
  setTransactionProcessor,
  setEscrow,
  changePriority,
  changeCountry,
  changeState,
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
  changeSearchPriorityData,
  setBtcAddress,
  setEthAddress,
  setup,
  setupSucceeded,
  setupFailed
} from './accountActions';

const defaultState = {
  referrer: true,
  btcAddress: '',
  ethAddress: '',
  publisher: false,
  transactionProcessor: false,
  wantsToVote: false,
  escrow: false,
  recentTransactions: [],
  recentTransactionsFiltered: [],
  recentTransactionsVisible: [],
  coinType: null,
  sortDirection: 'descending',
  sortColumn: 'date',
  activePage: 1,
  totalPages: 1,
  rowsPerPage: 20,
  filterText: '',
  showDetails: false,
  detailSelected: {},
  rescanBlockchain: false,
  votes: [],
  votesFiltered: [],
  sortVoteDirection: 'descending',
  sortVoteColumn: 'processor',
  loading: false,
  loadingRecentTransactions: false,
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
    state: '',
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
  ipAddress: '',
  setup: {
    loading: false,
    error: null
  }
};

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => (
  Math.ceil(data.length / rowsPerPage)
);

const getBadgeClass = (type) => {
  switch (type) {
    case ChainTypes.operations.escrow_create_operation:
      return 'pending';
    case ChainTypes.operations.transfer:
      return 'transfer';
    case ChainTypes.operations.escrow_release_operation:
      return 'released';
    case ChainTypes.operations.escrow_return_operation:
      return 'returned';
    case ChainTypes.operations.listing_delete_operation:
      return 'listing';
    case ChainTypes.operations.listing_update_operation:
      return 'listing';
    case ChainTypes.operations.listing_create_operation:
      return 'listing';
    case ChainTypes.operations.account_update:
      return 'account';
    case ChainTypes.operations.witness_create:
      return 'account';
    case ChainTypes.operations.welcome_bonus_operation:
      return 'wBonus';
    case ChainTypes.operations.referral_bonus_operation:
      return 'rBonus';
    case ChainTypes.operations.sale_bonus_operation:
      return 'sBonus';
    case ChainTypes.operations.witness_bonus_operation:
      return 'witBonus';
    case ChainTypes.operations.founder_bonus_operation:
      return 'fBonus';
    case ChainTypes.operations.vesting_balance_withdraw:
      return 'vestingWithdraw';
    case ChainTypes.operations.exchange_complete_operation:
      return 'exchange';
    default:
      break;
  }
};

const getStatusMessaage = (type) => {
  switch (type) {
    case ChainTypes.operations.escrow_create_operation:
      return 'pending';
    case ChainTypes.operations.transfer:
      return 'transfer';
    case ChainTypes.operations.escrow_release_operation:
      return 'released';
    case ChainTypes.operations.escrow_return_operation:
      return 'returned';
    case ChainTypes.operations.listing_delete_operation:
    case ChainTypes.operations.listing_update_operation:
    case ChainTypes.operations.listing_create_operation:
      return 'listing';
    case ChainTypes.operations.account_update:
    case ChainTypes.operations.witness_create:
      return 'account';
    case ChainTypes.operations.welcome_bonus_operation:
      return 'welcome bonus';
    case ChainTypes.operations.referral_bonus_operation:
      return 'referral bonus';
    case ChainTypes.operations.sale_bonus_operation:
      return 'sale bonus';
    case ChainTypes.operations.witness_bonus_operation:
      return 'processor bonus';
    case ChainTypes.operations.founder_bonus_operation:
      return 'developer bonus';
    case ChainTypes.operations.vesting_balance_withdraw:
      return 'vesting withdraw';
    case ChainTypes.operations.exchange_complete_operation:
      return 'exchange';
    default:
      break;
  }
};

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
        state: '',
        city: '',
        publisherName: ''
      };
      break;
    case PriorityTypes.PUBLISHER:
      newData = {
        country: '',
        state: '',
        city: '',
        keywords: []
      };
      break;
    default:
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
      referrer: !state.referrer,
    };
  },
  [setBtcAddress](state, { payload: { address } }) {
    return {
      ...state,
      btcAddress: address,
    };
  },
  [setEthAddress](state, { payload: { address } }) {
    return {
      ...state,
      ethAddress: address,
    };
  },
  [setPublisher](state) {
    return {
      ...state,
      publisher: !state.publisher,
    };
  },
  [setTransactionProcessor](state, { payload: { wantsToVote } }) {
    return {
      ...state,
      transactionProcessor: !state.transactionProcessor,
      wantsToVote
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
  [changeState](state, { payload }) {
    return {
      ...state,
      publisherData: {
        ...state.publisherData,
        state: payload.state
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
  [getRecentTransactions](state, { payload: { coinType } }) {
    return {
      ...state,
      recentTransactions: [],
      recentTransactionsFiltered: [],
      recentTransactionsVisible: [],
      coinType,
      loadingRecentTransactions: true,
      error: null
    };
  },
  GET_RECENT_TRANSACTIONS_SUCCEEDED: (state, { transactions }) => {
    const changedTransactions = transactions.map((item) => ({
      ...item,
      statusText: getBadgeClass(item.type),
    }));
    return {
      ...state,
      loadingRecentTransactions: false,
      error: null,
      recentTransactions: changedTransactions,
      recentTransactionsFiltered: changedTransactions,
    };
  },
  GET_RECENT_TRANSACTIONS_FAILED: (state, { error }) => ({
    ...state,
    loadingRecentTransactions: false,
    error
  }),
  [filterData](state, { payload: { filterText } }) {
    const activePage = 1;
    const { rowsPerPage } = state;
    let filteredData = state.recentTransactions;
    if (filterText) {
      filteredData = filteredData.filter(el => {
        const textEl = ChainTypes.operations.transfer === el.type && el.listingId ? `${JSON.stringify(el)} SALE` : JSON.stringify(el) + getStatusMessaage(el.type);
        return textEl.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
      });
    }
    const totalPages = getTotalPages(filteredData, rowsPerPage);
    const currentData = sliceData(filteredData, activePage, rowsPerPage);
    return {
      ...state,
      filterText,
      activePage,
      totalPages,
      recentTransactionsFiltered: filteredData,
      recentTransactionsVisible: currentData
    };
  },
  [setPagination](state, { payload: { rowsPerPage } }) {
    const data = state.recentTransactionsFiltered;
    const { activePage } = state;
    const totalPages = getTotalPages(data, rowsPerPage);
    const currentData = sliceData(data, activePage, rowsPerPage);

    return {
      ...state,
      totalPages,
      rowsPerPage,
      recentTransactionsVisible: currentData,
    };
  },
  [setActivePage](state, { payload: { activePage } }) {
    const data = state.recentTransactionsFiltered;
    if (activePage !== state.activePage) {
      const { rowsPerPage, sortDirection, sortColumn } = state;
      let sortedData = [];
      let currentData = [];

      if (sortColumn === 'date') {
        sortedData = data.sort((a, b) => {
          const aDate = dateformat(a[sortColumn], 'yyyy-mm-dd HH:MM:ss');
          const bDate = dateformat(b[sortColumn], 'yyyy-mm-dd HH:MM:ss');
          if (aDate > bDate) return -1;
          if (aDate < bDate) return 1;
          return 0;
        });
        sortedData = sortDirection === 'ascending' ? sortedData.reverse() : sortedData;
      } else {
        sortedData = data;
        // const sortBy = _.sortBy(data, [sortColumn]);
        // sortedData = sortDirection === 'ascending' ? sortBy.reverse() : sortBy;
      }
      currentData = sliceData(sortedData, activePage, rowsPerPage);

      return {
        ...state,
        activePage,
        recentTransactionsVisible: currentData,
      };
    }

    return {
      ...state,
    };
  },
  [sortData](state, { payload: { sortColumn, direction } }) {
    const { filterText } = state;
    let sortDirection = direction || state.sortDirection === 'ascending' ? 'descending' : 'ascending';
    let data = state.recentTransactionsFiltered;
    let sortedData = [];
    let activePageSort = state.activePage;

    if (sortColumn === 'date') {
      sortedData = data.sort((a, b) => {
        const aDate = dateformat(a[sortColumn], 'yyyy-mm-dd HH:MM:ss');
        const bDate = dateformat(b[sortColumn], 'yyyy-mm-dd HH:MM:ss');
        if (aDate > bDate) return -1;
        if (aDate < bDate) return 1;
        return 0;
      });
      sortedData = sortDirection === 'ascending' ? sortedData.reverse() : sortedData;
    } else {
      const sortBy = _.sortBy(data, [sortColumn]);
      if (state.sortColumn !== sortColumn) {
        sortedData = sortBy.reverse();
        sortDirection = 'ascending';
        activePageSort = 1;
      } else {
        sortedData = sortDirection === 'ascending' ? sortBy.reverse() : sortBy;
      }
    }

    if (filterText) {
      data = data.filter(el => JSON.stringify(el).indexOf(filterText) !== -1);
    }

    const sortFields = [sortColumn];
    if (sortColumn === 'fromTo') {
      sortFields.unshift('isIncoming');
    }
    sortedData = _.orderBy(data, sortFields, [sortDirection === 'ascending' ? 'asc' : 'desc']);

    const { rowsPerPage } = state;
    const currentData = sliceData(sortedData, activePageSort, rowsPerPage);


    return {
      ...state,
      recentTransactionsFiltered: sortedData,
      recentTransactionsVisible: currentData,
      sortDirection,
      sortColumn,
      activePage: activePageSort
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
      votesFiltered: sortedData,
      votesVisible: currentData,
      sortVoteDirection,
      sortVoteColumn,
    };
  },
  [changeIpAddress](state, { payload: { ip } }) {
    return {
      ...state,
      ipAddress: ip
    };
  },
  LOGOUT: (state) => ({
    ...state,
    ...defaultState,
  }),
  [setup](state) {
    return {
      ...state,
      setup: {
        loading: true,
        error: null
      }
    }
  },
  [setupSucceeded](state) {
    return {
      ...state,
      setup: {
        loading: false,
        error: null
      }
    }
  },
  [setupFailed](state, { payload: { error }}) {
    return {
      ...state,
      setup: {
        loading: false,
        error
      }
    }
  }
}, defaultState);

export default reducer;
