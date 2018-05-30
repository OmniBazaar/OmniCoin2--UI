import { handleActions } from 'redux-actions';
import _ from 'lodash';
import SearchHistory from './searchHistory';

import {
  filterSearchResults,
  getRecentSearches,
  getRecentSearchesSucceeded,
  getRecentSearchesFailed,
  getSavedSearches,
  getSavedSearchesSucceeded,
  getSavedSearchesFailed,
  sortRecentSearches,
  sortSavedSearches,
  saveSearch,
  saveSearchSucceeded,
  saveSearchFailed,
  deleteSearch,
  deleteSearchSucceeded,
  deleteSearchFailed,
  searching,
  marketplaceReturnListings,
  marketplaceReturnBool,
  searchListings
} from './searchActions';

const defaultState = {
  recentSearches: [],
  recentSortOptions: {
    by: 'date',
    direction: 'descending',
  },
  savedSearches: [],
  savedSortOptions: {
    by: 'date',
    direction: 'descending'
  },
  searchResults: [],
  searchResultsFiltered: null,
  searchId: null,
  searchText: '',
  loading: false,
  saving: false,
  deleting: false,
  searching: false,
  error: null
};

const rowsPerPageSearchResults = 20;

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => Math.ceil(data.length / rowsPerPage);

const reducer = handleActions({
  [filterSearchResults](state, { payload: { searchText } }) {
    const data = state.searchResults;
    const activePageSearchResults = 1;
    let totalPagesSearchResults;
    let currentData = [];

    if (searchText !== '') {
      let filteredData = data.filter(listing => {
        return Object.values(listing).filter(
           value => {  return value.toString().toLowerCase().indexOf(searchText.toLowerCase()) !== -1 }
         ).length !== 0;
      });
      filteredData = _.without(filteredData, undefined);
      totalPagesSearchResults = getTotalPages(filteredData, rowsPerPageSearchResults);
      currentData = sliceData(filteredData, activePageSearchResults, rowsPerPageSearchResults);
    } else {
      currentData = data;
      totalPagesSearchResults = getTotalPages(currentData, rowsPerPageSearchResults);
      currentData = sliceData(currentData, activePageSearchResults, rowsPerPageSearchResults);
    }
    return {
      ...state,
      searchText,
      activePageSearchResults,
      totalPagesSearchResults,
      searchResultsFiltered: currentData,
    };
  },
  [getRecentSearches](state) {
    return {
      ...state,
      loading: true,
      error: null
    };
  },
  [getRecentSearchesSucceeded](state, { payload: { recentSearches } }) {
    return {
      ...state,
      recentSearches,
      loading: false
    };
  },
  [getSavedSearchesFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      loading: false
    };
  },
  [getSavedSearches](state) {
    return {
      ...state,
      error: null,
      loading: true
    };
  },
  [getSavedSearchesSucceeded](state, { payload: { savedSearches } }) {
    return {
      ...state,
      savedSearches,
      loading: false
    };
  },
  [getSavedSearchesFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      loading: false
    };
  },
  [sortSavedSearches](state, { payload: { by, direction } }) {
    return {
      ...state,
      savedSearches: _.orderBy(state.savedSearches, [by], [direction === 'ascending' ? 'asc' : 'desc']),
      savedSortOptions: {
        by, direction
      }
    };
  },
  [sortRecentSearches](state, { payload: { by, direction } }) {
    return {
      ...state,
      recentSearches: _.orderBy(state.recentSearches, [by], [direction === 'ascending' ? 'asc' : 'desc']),
      recentSortOptions: {
        by, direction
      }
    };
  },
  [saveSearch](state) {
    return {
      ...state,
      error: null,
      saving: true
    };
  },
  [saveSearchSucceeded](state, { payload: { recentSearches } }) {
    return {
      ...state,
      recentSearches,
      saving: false
    };
  },
  [saveSearchFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      saving: false
    };
  },
  [deleteSearch](state) {
    return {
      ...state,
      error: null,
      deleting: true
    };
  },
  [deleteSearchSucceeded](state, { payload: { savedSearches } }) {
    return {
      ...state,
      savedSearches,
      deleting: false
    };
  },
  [deleteSearchFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      deleting: false
    };
  },
  [searchListings](state) {
    return {
      ...state,
      searchId: null,
      searchResults: [],
      searchResultsFiltered: null
    }
  },
  [searching](state, { payload: { searchId }}) {
    return {
      ...state,
      searchId,
      searchResults: [],
      searching: true,
    }
  },
  [marketplaceReturnListings](state, { data }) {
    const listings = JSON.parse(data.command.listings).listings.map(listing => ({
      ...listing,
      address: data.command.address
    }));
    if (parseInt(data.id) === state.searchId) {
      return {
        ...state,
        searchResults: [...state.searchResults, ...listings],
        searching: false,
      }
    } else {
      return {
        ...state,
        searching: false
      }
    }
  }
}, defaultState);

export default reducer;
