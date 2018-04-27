import { createActions } from 'redux-actions';

const {
  getSearchResults,
  filterSearchResults,
  getRecentSearches,
  sortRecentSearches,
  getSavedSearches,
  sortSavedSearches,
} = createActions({
  GET_SEARCH_RESULTS: (searchResults) => ({ searchResults }),
  FILTER_SEARCH_RESULTS: (searchText) => ({ searchText }),
  GET_RECENT_SEARCHES: (recentSearches) => ({ recentSearches }),
  SORT_RECENT_SEARCHES: (sortColumnRecent) => ({ sortColumnRecent }),
  GET_SAVED_SEARCHES: (savedSearches) => ({ savedSearches }),
  SORT_SAVED_SEARCHES: (sortColumnSaved) => ({ sortColumnSaved }),
});

export {
  getSearchResults,
  filterSearchResults,
  getRecentSearches,
  sortRecentSearches,
  getSavedSearches,
  sortSavedSearches
};
