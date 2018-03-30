import { createActions } from 'redux-actions';

const {
  getFeatureList,
  setPaginationFeature,
  setActivePageFeature,
  getForSaleList,
  getServicesList,
  getJobsList,
  getRentalsList,
  getCryptoBazaarList,
  setActiveCategory,
} = createActions({
  GET_FEATURE_LIST: (featureList) => ({ featureList }),
  SET_PAGINATION_FEATURE: (rowsPerPageFeature) => ({ rowsPerPageFeature }),
  SET_ACTIVE_PAGE_FEATURE: (activePageFeature) => ({ activePageFeature }),
  GET_FOR_SALE_LIST: (forSaleList) => ({ forSaleList }),
  GET_SERVICES_LIST: (servicesList) => ({ servicesList }),
  GET_JOBS_LIST: (jobsList) => ({ jobsList }),
  GET_RENTALS_LIST: (rentalsList) => ({ rentalsList }),
  GET_CRYPTO_BAZAAR_LIST: (cryptoBazaarList) => ({ cryptoBazaarList }),
  SET_ACTIVE_CATEGORY: (activeCategory, parentCategory) => ({ activeCategory, parentCategory }),
});

export {
  getFeatureList,
  setPaginationFeature,
  setActivePageFeature,
  getForSaleList,
  getServicesList,
  getJobsList,
  getRentalsList,
  getCryptoBazaarList,
  setActiveCategory
};
