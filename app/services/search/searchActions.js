import { createActions } from 'redux-actions';

const {
  getSearchResults,
  filterSearchResults,
  getRecentSearches,
  getSavedSearches,
} = createActions({
  GET_SEARCH_RESULTS: (searchResults) => ({ searchResults }),
  FILTER_SEARCH_RESULTS: (searchText) => ({ searchText }),
  GET_RECENT_SEARCHES: (recentSearches) => ({ recentSearches }),
  GET_SAVED_SEARCHES: (savedSearches) => ({ savedSearches }),
});

export {
  getSearchResults,
  filterSearchResults,
  getRecentSearches,
  getSavedSearches,
};
