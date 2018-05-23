import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  getSearchResults,
  filterSearchResults,
  getRecentSearches,
  getSavedSearches,
} from './searchActions';

const defaultState = {
  recentSearches: [],
  savedSearches: [],
  searchResults: [],
  searchResultsFiltered: [],
  searchText: '',
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
  [getRecentSearches](state, { payload: { recentSearches } }) {
    const sortedData = _.sortBy(recentSearches, ['date']).reverse();
    return {
      ...state,
      recentSearches: sortedData
    };
  },
  [getSavedSearches](state, { payload: { savedSearches } }) {
    const sortedData = _.sortBy(savedSearches, ['date']).reverse();
    return {
      ...state,
      savedSearches: sortedData
    };
  },

}, defaultState);

export default reducer;
