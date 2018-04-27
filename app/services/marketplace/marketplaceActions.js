import { createActions } from 'redux-actions';

const {
  getCategories,
  getFeatureList,
  setPaginationFeature,
  setActivePageFeature,
  getForSaleList,
  getServicesList,
  getJobsList,
  getRentalsList,
  getCryptoBazaarList,
  setActiveCategory,
  getRecentSearches,

  setPaginationGridTable,
  sortGridTableBy,
  setActivePageGridTable
} = createActions({
  GET_CATEGORIES: () => ({}),
  GET_FEATURE_LIST: (featureList) => ({ featureList }),
  SET_PAGINATION_FEATURE: (rowsPerPageFeature) => ({ rowsPerPageFeature }),
  SET_ACTIVE_PAGE_FEATURE: (activePageFeature) => ({ activePageFeature }),
  GET_FOR_SALE_LIST: (forSaleList) => ({ forSaleList }),
  GET_SERVICES_LIST: (servicesList) => ({ servicesList }),
  GET_JOBS_LIST: (jobsList) => ({ jobsList }),
  GET_RENTALS_LIST: (rentalsList) => ({ rentalsList }),
  GET_CRYPTO_BAZAAR_LIST: (cryptoBazaarList) => ({ cryptoBazaarList }),
  SET_ACTIVE_CATEGORY: (activeCategory, parentCategory) => ({ activeCategory, parentCategory }),
  GET_RECENT_SEARCHES: (recentSearches) => ({ recentSearches }),
  SET_PAGINATION_GRID_TABLE: (rowsPerPageGridTable) => ({ rowsPerPageGridTable }),
  SORT_GRID_TABLE_BY: (gridTableData, sortGridBy, sortGridDirection) =>
    ({ gridTableData, sortGridBy, sortGridDirection }),
  SET_ACTIVE_PAGE_GRID_TABLE: (activePageGridTable) => ({ activePageGridTable }),
});

export {
  getCategories,
  getFeatureList,
  setPaginationFeature,
  setActivePageFeature,
  getForSaleList,
  getServicesList,
  getJobsList,
  getRentalsList,
  getCryptoBazaarList,
  setActiveCategory,
  getRecentSearches,
  setPaginationGridTable,
  sortGridTableBy,
  setActivePageGridTable
};
