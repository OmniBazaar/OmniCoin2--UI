import { createActions } from 'redux-actions';

const {
  getSearchResults,
  setPaginationSearchResults,
  sortSearchResultsBy,
  setActivePageSearchResults,
  filterSearchResults,
  getRecentSearches,
  sortRecentSearches,
  getSavedSearches,
  sortSavedSearches,
} = createActions({
  GET_SEARCH_RESULTS: (searchResults) => ({ searchResults }),
  SET_PAGINATION_SEARCH_RESULTS: (rowsPerPageSearchResults) => ({ rowsPerPageSearchResults }),
  SORT_SEARCH_RESULTS_BY: (sortSearchBy, sortSearchDirection) => ({ sortSearchBy, sortSearchDirection }),
  SET_ACTIVE_PAGE_SEARCH_RESULTS: (activePageSearchResults) => ({ activePageSearchResults }),
  FILTER_SEARCH_RESULTS: (searchText) => ({ searchText }),
  GET_RECENT_SEARCHES: (recentSearches) => ({ recentSearches }),
  SORT_RECENT_SEARCHES: (sortColumnRecent) => ({ sortColumnRecent }),
  GET_SAVED_SEARCHES: (savedSearches) => ({ savedSearches }),
  SORT_SAVED_SEARCHES: (sortColumnSaved) => ({ sortColumnSaved }),
});

export {
  getSearchResults,
  setPaginationSearchResults,
  sortSearchResultsBy,
  setActivePageSearchResults,
  filterSearchResults,
  getRecentSearches,
  sortRecentSearches,
  getSavedSearches,
  sortSavedSearches
};
