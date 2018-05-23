import { createActions } from 'redux-actions';

const {
  searchListings,
  getSearchResults,
  filterSearchResults,
  getRecentSearches,
  getSavedSearches,
} = createActions({
  SEARCH_LISTINGS: (searchTerm, category) => ({searchTerm, category}),
  GET_SEARCH_RESULTS: (searchResults) => ({ searchResults }),
  FILTER_SEARCH_RESULTS: (searchText) => ({ searchText }),
  GET_RECENT_SEARCHES: (recentSearches) => ({ recentSearches }),
  GET_SAVED_SEARCHES: (savedSearches) => ({ savedSearches }),
});

export {
  searchListings,
  getSearchResults,
  filterSearchResults,
  getRecentSearches,
  getSavedSearches,
};
