import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  getSearchResults,
  filterSearchResults,
  getRecentSearches,
  sortRecentSearches,
  getSavedSearches,
  sortSavedSearches
} from './searchActions';

const defaultState = {
  recentSearches: [],
  savedSearches: [],
  searchResults: [],
  searchResultsFiltered: [],
  searchText: '',
  sortColumnRecent: 'date',
  sortDirectionRecent: 'descending',
  sortColumnSaved: 'date',
  sortDirectionSaved: 'descending',
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
  [sortRecentSearches](state, { payload: { sortColumnRecent } }) {
    let sortDirectionRecent = state.sortDirectionRecent === 'ascending' ? 'descending' : 'ascending';
    const sortBy = _.sortBy(state.recentSearches, [sortColumnRecent]);
    let sortedData = [];

    if (state.sortColumnRecent !== sortColumnRecent) {
      sortedData = sortBy.reverse();
      sortDirectionRecent = 'ascending';
    } else {
      sortedData = sortDirectionRecent === 'ascending' ? sortBy.reverse() : sortBy;
    }

    return {
      ...state,
      recentSearches: sortedData,
      sortDirectionRecent,
      sortColumnRecent,
    };
  },
  [getSavedSearches](state, { payload: { savedSearches } }) {
    const sortedData = _.sortBy(savedSearches, ['date']).reverse();
    return {
      ...state,
      savedSearches: sortedData
    };
  },
  [sortSavedSearches](state, { payload: { sortColumnSaved } }) {
    let sortDirectionSaved = state.sortDirectionSaved === 'ascending' ? 'descending' : 'ascending';
    const sortBy = _.sortBy(state.recentSearches, [sortColumnSaved]);
    let sortedData = [];

    if (state.sortColumnSaved !== sortColumnSaved) {
      sortedData = sortBy.reverse();
      sortDirectionSaved = 'ascending';
    } else {
      sortedData = sortDirectionSaved === 'ascending' ? sortBy.reverse() : sortBy;
    }

    return {
      ...state,
      savedSearches: sortedData,
      sortDirectionSaved,
      sortColumnSaved,
    };
  },
}, defaultState);

export default reducer;
