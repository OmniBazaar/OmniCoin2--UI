import { handleActions } from 'redux-actions';
import _ from 'lodash';
import SearchHistory from './searchHistory';
import { categories } from '../../scenes/Home/scenes/Marketplace/categories';

import {
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
  searching,
  marketplaceReturnListings,
  marketplaceReturnBool,
  searchListings,
  filterSearchByCategory
} from './searchActions';

const defaultState = {
  recentSearches: [],
  recentSortOptions: {
    by: 'date',
    direction: 'descending',
  },
  savedSearches: [],
  savedSortOptions: {
    by: 'date',
    direction: 'descending'
  },
  searchResults: [],
  searchCategory: 'all',
  searchCurrency: 'all',
  searchResultsFiltered: null,
  searchId: null,
  searchText: '',
  searchTerm: '',
  category: '',
  loading: false,
  saving: false,
  deleting: false,
  searching: false,
  fromSearchMenu: false,
  error: null
};

const rowsPerPageSearchResults = 20;

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => Math.ceil(data.length / rowsPerPage);

const searchByFilters = (listings, currency, category) => {
  const currencyFilter = (currency && currency.toLowerCase()) || 'all';
  const categoryFilter = (category && category.toLowerCase()) || 'all';

  let searchesFiltered = listings;
  if (currencyFilter !== 'all' && categoryFilter !== 'all') {
    searchesFiltered = listings
      .filter(el => el.currency.toLowerCase() === currencyFilter)
      .filter(el => el.category.toLowerCase() === categoryFilter);
  } else {
    if (currencyFilter !== 'all') searchesFiltered = listings.filter(el => el.currency.toLowerCase() === currencyFilter);
    if (categoryFilter !== 'all') searchesFiltered = listings.filter(el => el.category.toLowerCase() === categoryFilter);
  }
  return {
    searchCurrency: currency,
    searchCategory: category,
    searchesFiltered
  };
};

const reducer = handleActions({
  [filterSearchResults](state, { payload: { searchText, currency, category } }) {
    const data = state.searchResults;
    const activePageSearchResults = 1;
    let totalPagesSearchResults;
    let currentData = [];
    let resultByFilters = [];

    if (searchText !== '') {
      let filteredData = data.filter(listing => {
        return Object.values(listing).filter(
         value => { return value.toString().toLowerCase().indexOf(searchText.toLowerCase()) !== -1; }
        ).length !== 0;
      });
      filteredData = _.without(filteredData, undefined);
      resultByFilters = searchByFilters(filteredData, currency, category);
      totalPagesSearchResults = getTotalPages(resultByFilters.searchesFiltered, rowsPerPageSearchResults);
      currentData = sliceData(resultByFilters.searchesFiltered, activePageSearchResults, rowsPerPageSearchResults);
    } else {
      currentData = data;
      resultByFilters = searchByFilters(currentData, currency, category);
      totalPagesSearchResults = getTotalPages(resultByFilters.searchesFiltered, rowsPerPageSearchResults);
      currentData = sliceData(resultByFilters.searchesFiltered, activePageSearchResults, rowsPerPageSearchResults);
    }

    return {
      ...state,
      searchText,
      activePageSearchResults,
      totalPagesSearchResults,
      searchResultsFiltered: currentData,
    };
  },
  [filterSearchByCategory](state) {
    const data = state.searchResults;

    const forSaleListings = {
      category: categories.forSale,
      listings: []
    };

    const jobsListings = {
      category: categories.jobs,
      listings: []
    };

    const servicesListings = {
      category: categories.services,
      listings: []
    };

    const cryptoBazaarListings = {
      category: categories.cryptoBazaar,
      listings: []
    };

    const rentalsListings = {
      category: categories.rentals,
      listings: []
    };

    data.forEach((listing) => {
      switch (listing.category) {
        case categories.forSale:
          forSaleListings.listings.push(listing);
          break;
        case categories.jobs:
          jobsListings.listings.push(listing);
          break;
        case categories.services:
          servicesListings.listings.push(listing);
          break;
        case categories.cryptoBazaar:
          cryptoBazaarListings.listings.push(listing);
          break;
        case categories.rentals:
          rentalsListings.listings.push(listing);
          break;
        default:
      }
    });

    return {
      ...state,
      searchResultsByCategory: [
        forSaleListings, jobsListings, servicesListings, cryptoBazaarListings, rentalsListings]
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
  },
  [searchListings](state, { payload: { searchTerm, category }}) {
    return {
      ...state,
      searchId: null,
      searchResults: [],
      searchResultsFiltered: null,
      searchTerm,
      category
    };
  },
  [searching](state, { payload: { searchId, searchTerm, category, subCategory, fromSearchMenu }}) {
    return {
      ...state,
      searchId,
      searchResults: [],
      searchResultsFiltered: [],
      searching: true,
      searchTerm,
      category,
      subCategory,
      fromSearchMenu
    };
  },
  [marketplaceReturnListings](state, { data }) {
    const commandListings = JSON.parse(data.command.listings);
    const listings = commandListings.listings ? commandListings.listings.map(listing => ({
      ...listing,
      ip: data.command.address
    })) : [];

    if (parseInt(data.id, 10) === state.searchId) {
      return {
        ...state,
        searchResults: [...state.searchResults, ...listings],
        searchResultsFiltered: [...state.searchResults, ...listings],
        searching: false,
      };
    }

    return {
      ...state,
      searching: false
    };
  }
}, defaultState);

export default reducer;
