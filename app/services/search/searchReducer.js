import { handleActions } from 'redux-actions';
import _ from 'lodash';
import SearchHistory from './searchHistory';

import {
  getSearchResults,
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
  deleteSearchFailed
} from './searchActions';
import SavedSearches from '../../scenes/Home/scenes/Marketplace/scenes/Search/scenes/SavedSearches/SavedSearches';

const defaultState = {
  recentSearches: [],
  recentSortOptions: {
    by: 'date',
    direction: 'desc',
  },
  savedSearches: [],
  savedSortOptions: {
    by: 'date',
    direction: 'desc'
  },
  searchResults: [],
  searchResultsFiltered: [],
  searchText: '',
  loading: false,
  saving: false,
  deleting: false,
  error: null
};

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => Math.ceil(data.length / rowsPerPage);

const reducer = handleActions({
  [getSearchResults](state, { payload: { searchResults } }) {
    return {
      ...state,
      searchResults,
      searchResultsFiltered: searchResults
    };
  },
  [filterSearchResults](state, { payload: { searchText } }) {
    const data = state.searchResults;
    const activePageSearchResults = 1;
    let { totalPagesSearchResults } = state;
    const { rowsPerPageSearchResults } = state;
    let currentData = [];

    if (searchText !== '') {
      let filteredData = _.map(data, (o) => {
        const values = Object.values(o);
        const result = _.map(values, (val) => {
          if (val) {
            if (val.toString().toLowerCase().indexOf(searchText.toLowerCase()) !== -1) return o;
          }
        });
        return _.without(result, undefined)[0];
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
  }
}, defaultState);

export default reducer;
