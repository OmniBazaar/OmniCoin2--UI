import { createActions } from 'redux-actions';

const {
  getFeatureList,
  getForSaleList,
  getServicesList,
  getJobsList,
  getRentalsList,
  getCryptoBazaarList,
  setActiveCategory,
} = createActions({
  GET_FEATURE_LIST: (featureList) => ({ featureList }),
  GET_FOR_SALE_LIST: (forSaleList) => ({ forSaleList }),
  GET_SERVICES_LIST: (servicesList) => ({ servicesList }),
  GET_JOBS_LIST: (jobsList) => ({ jobsList }),
  GET_RENTALS_LIST: (rentalsList) => ({ rentalsList }),
  GET_CRYPTO_BAZAAR_LIST: (cryptoBazaarList) => ({ cryptoBazaarList }),
  SET_ACTIVE_CATEGORY: (activeCategory, parentCategory) => ({ activeCategory, parentCategory }),
});

export {
  getFeatureList,
  getForSaleList,
  getServicesList,
  getJobsList,
  getRentalsList,
  getCryptoBazaarList,
  setActiveCategory
};
