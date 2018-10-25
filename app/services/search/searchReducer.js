import { handleActions } from 'redux-actions';
import _ from 'lodash';
import SearchHistory from './searchHistory';
import { categories } from '../../scenes/Home/scenes/Marketplace/categories';
import { currencyConverter } from '../utils';

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
  searchResultEmpty,
  marketplaceReturnListings,
  marketplaceReturnBool,
  searchListings,
  filterSearchByCategory,
  setSearchListingsParams,
  clearSearchResults
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
  error: null,
  currency: null,
  searchListingsParams: {}
};

const rowsPerPageSearchResults = 18;

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => Math.ceil(data.length / rowsPerPage);

const searchByFilters = (listings, category, subCategory) => {
  const categoryFilter = (category && category.toLowerCase()) || 'all';
  const subCategoryFilter = (subCategory && subCategory.toLowerCase()) || 'all';

  let searchesFiltered = listings;
  if (categoryFilter !== 'all' && subCategoryFilter !== 'all') {
    searchesFiltered = listings
      .filter(el => el.category.toLowerCase() === categoryFilter)
      .filter(el => el.subcategory.toLowerCase() === subCategoryFilter);
  } else {
    if (categoryFilter !== 'all') searchesFiltered = listings.filter(el => el.category.toLowerCase() === categoryFilter);
    if (subCategoryFilter !== 'all') searchesFiltered = listings.filter(el => el.subcategory.toLowerCase() === subCategoryFilter);
  }

  return {
    searchesFiltered
  };
};

const changeCurrencies = (selectedCurrency, listing) => listing.map((item) => {
  if (selectedCurrency === item.currency) {
    return {
      ...item,
      convertedPrice: item.price,
    };
  }

  const price = currencyConverter(item.price, item.currency, selectedCurrency);

  return {
    ...item,
    convertedPrice: price
  };
});

const filterResultData = (searchResults, {
  searchText, currency, category, subCategory
}) => {
  let data = searchResults;

  const activePageSearchResults = 1;
  let totalPagesSearchResults;
  if (currency !== 'all' && currency !== undefined) {
    data = changeCurrencies(currency, data);
  }
  let currentData = [];
  let resultByFilters = [];

  if (searchText) {
    let filteredData = data.filter(listing => Object.values(listing).filter(value => value.toString().toLowerCase().indexOf(searchText.toLowerCase()) !== -1).length !== 0);
    filteredData = _.without(filteredData, undefined);
    resultByFilters = searchByFilters(filteredData, category, subCategory);
    /*
    totalPagesSearchResults = getTotalPages(resultByFilters.searchesFiltered, rowsPerPageSearchResults);
    currentData = sliceData(resultByFilters.searchesFiltered, activePageSearchResults, rowsPerPageSearchResults);
    */
  } else {
    currentData = data;
    resultByFilters = searchByFilters(currentData, category, subCategory);
    /*
    totalPagesSearchResults = getTotalPages(resultByFilters.searchesFiltered, rowsPerPageSearchResults);
    currentData = sliceData(resultByFilters.searchesFiltered, activePageSearchResults, rowsPerPageSearchResults);
    */
  }

  return {
    searchText,
    searchResultsFiltered: resultByFilters.searchesFiltered,
    currency
  };
};

const reducer = handleActions({

  [filterSearchResults](state, {
    payload: {
      searchText, currency, category, subCategory
    }
  }) {
    const filterData = filterResultData(state.searchResults, {
      searchText, currency, category, subCategory
    });

    return {
      ...state,
      ...filterData
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
  [searchListings](state, { payload: { searchTerm, category, subCategory } }) {
    return {
      ...state,
      searchId: null,
      searchResults: [],
      searchResultsFiltered: null,
      searchTerm,
      category,
      subCategory
    };
  },
  [searching](state, {
    payload: {
      searchId, searchTerm, category, subCategory, fromSearchMenu
    }
  }) {
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
  [searchResultEmpty](state, { payload: { searchId } }) {
    if (state.searchId === searchId) {
      return {
        ...state,
        searchResults: [],
        searchResultsFiltered: [],
        searching: false
      };
    }
    
    return state;
  },
  [marketplaceReturnListings](state, { data }) {
    const commandListings = JSON.parse(data.command.listings);
    const listings = commandListings.listings ? commandListings.listings.map(listing => ({
      ...listing,
      ip: data.command.address
    })) : [];

    if (parseInt(data.id, 10) === state.searchId) {
      const searchResults = [
        ...state.searchResults,
        ...listings
      ];
      const filterResults = filterResultData(searchResults, {
        searchText: '',
        currency: state.currency,
        category: state.category,
        subCategory: state.subcategory
      });
      return {
        ...state,
        searchResults,
        searchResultsFiltered: filterResults.searchResultsFiltered,
        searching: false,
      };
    }

    return {
      ...state,
      searching: false
    };
  },
  [setSearchListingsParams](state, { payload }) {
    return {
      ...state,
      searchId: null,
      searchResults: [],
      searchResultsFiltered: null,
      searchListingsParams: payload
    };
  },
  [clearSearchResults](state) {
    return {
      ...state,
      searchResults: [],
      searchResultsFiltered: null
    };
  }
}, defaultState);

export default reducer;
