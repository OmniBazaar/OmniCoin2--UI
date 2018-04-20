import { createActions } from 'redux-actions';

const {
  setExtendedSearch,
  getSearchResults,
  setPaginationSearchResults,
  sortSearchResultsBy,
  setActivePageSearchResults,
  filterSearchResults
} = createActions({
  SET_EXTENDED_SEARCH: () => ({}),
  GET_SEARCH_RESULTS: (searchResults) => ({ searchResults }),
  SET_PAGINATION_SEARCH_RESULTS: (rowsPerPageSearchResults) => ({ rowsPerPageSearchResults }),
  SORT_SEARCH_RESULTS_BY: (sortSearchBy, sortSearchDirection) => ({ sortSearchBy, sortSearchDirection }),
  SET_ACTIVE_PAGE_SEARCH_RESULTS: (activePageSearchResults) => ({ activePageSearchResults }),
  FILTER_SEARCH_RESULTS: (searchText) => ({ searchText }),
});

export {
  setExtendedSearch,
  getSearchResults,
  setPaginationSearchResults,
  sortSearchResultsBy,
  setActivePageSearchResults,
  filterSearchResults
};
