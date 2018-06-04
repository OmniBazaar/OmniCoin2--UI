import { createActions } from 'redux-actions';

const {
  searchListings,
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
  marketplaceReturnListings,
  marketplaceReturnBool,
  searching
} = createActions({
  SEARCH_LISTINGS: (searchTerm, category, country, city, historify = true) => ({
    searchTerm, category, country, city, historify
  }),
  FILTER_SEARCH_RESULTS: (searchText) => ({ searchText }),
  GET_RECENT_SEARCHES: () => ({ }),
  GET_RECENT_SEARCHES_SUCCEEDED: (recentSearches) => ({ recentSearches }),
  GET_RECENT_SEARCHES_FAILED: (error) => ({ error }),
  GET_SAVED_SEARCHES: (username) => ({ username }),
  GET_SAVED_SEARCHES_SUCCEEDED: (savedSearches) => ({ savedSearches }),
  GET_SAVED_SEARCHES_FAILED: (error) => ({ error }),
  SORT_RECENT_SEARCHES: (by, direction) => ({ by, direction }),
  SORT_SAVED_SEARCHES: (by, direction) => ({ by, direction }),
  SAVE_SEARCH: (search) => ({ search }),
  SAVE_SEARCH_SUCCEEDED: (recentSearches) => ({ recentSearches }),
  SAVE_SEARCH_FAILED: (error) => ({ error }),
  DELETE_SEARCH: (search) => ({ search }),
  DELETE_SEARCH_SUCCEEDED: (savedSearches) => ({ savedSearches }),
  DELETE_SEARCH_FAILED: (error) => ({ error }),
  MARKETPLACE_RETURN_LISTINGS: (data) => ({ data }),
  MARKETPLACE_RETURN_BOOL: (data) => ({ data }),
  SEARCHING: (searchId) => ({ searchId })
});

export {
  searchListings,
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
  marketplaceReturnBool,
  marketplaceReturnListings,
  searching
};
