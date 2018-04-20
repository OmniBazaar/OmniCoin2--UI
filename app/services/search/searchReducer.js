import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  setExtendedSearch,
  getSearchResults,
  setPaginationSearchResults,
  sortSearchResultsBy,
  setActivePageSearchResults,
  filterSearchResults
} from './searchActions';

const defaultState = {
  extendedSearch: false,
  searchResults: [],
  searchResultsFiltered: [],
  activePageSearchResults: 1,
  totalPagesSearchResults: 1,
  rowsPerPageSearchResults: 3 * 6,
  searchText: ''
};

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => Math.ceil(data.length / rowsPerPage);

const reducer = handleActions({
  [setExtendedSearch](state) {
    return {
      ...state,
      extendedSearch: !state.extendedSearch
    };
  },
  [getSearchResults](state, { payload: { searchResults } }) {
    return {
      ...state,
      searchResults,
      searchResultsFiltered: searchResults
    };
  },
  [setPaginationSearchResults](state, { payload: { rowsPerPageSearchResults } }) {
    const data = state.searchResults;
    const { activePageSearchResults } = state;
    const totalPagesSearchResults = getTotalPages(data, rowsPerPageSearchResults);
    const currentData = sliceData(data, activePageSearchResults, rowsPerPageSearchResults);

    return {
      ...state,
      totalPagesSearchResults,
      rowsPerPageSearchResults,
      searchResultsFiltered: currentData,
    };
  },
  [sortSearchResultsBy](state, { payload: { sortSearchBy, sortSearchDirection } }) {
    let sortedData = _.sortBy(state.searchResults, [sortSearchBy]);
    if (sortSearchDirection === 'descending') {
      sortedData = sortedData.reverse();
    }

    return {
      ...state,
      searchResults: sortedData,
      searchResultsFiltered: sortedData
    };
  },
  [setActivePageSearchResults](state, { payload: { activePageSearchResults } }) {
    const data = state.searchResults;
    if (activePageSearchResults !== state.activePageSearchResults) {
      const { rowsPerPageSearchResults } = state;
      const currentData = sliceData(data, activePageSearchResults, rowsPerPageSearchResults);

      return {
        ...state,
        activePageSearchResults,
        searchResultsFiltered: currentData,
      };
    }

    return {
      ...state,
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
}, defaultState);

export default reducer;
