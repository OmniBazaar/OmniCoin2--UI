import { createActions } from 'redux-actions';

const {
  getCategories,
  getFeatureList,
  getForSaleList,
  getServicesList,
  getJobsList,
  getRentalsList,
  getCryptoBazaarList,
  getForSaleCategories,
  getServicesCategories,
  getJobsCategories,
  getCryptoCategories
} = createActions({
  GET_CATEGORIES: () => ({}),
  GET_FEATURE_LIST: (featureList) => ({ featureList }),
  GET_FOR_SALE_LIST: (forSaleList) => ({ forSaleList }),
  GET_SERVICES_LIST: (servicesList) => ({ servicesList }),
  GET_JOBS_LIST: (jobsList) => ({ jobsList }),
  GET_RENTALS_LIST: (rentalsList) => ({ rentalsList }),
  GET_CRYPTO_BAZAAR_LIST: (cryptoBazaarList) => ({ cryptoBazaarList }),
  GET_FOR_SALE_CATEGORIES: (forSaleCategories) => ({ forSaleCategories }),
  GET_SERVICES_CATEGORIES: (servicesCategories) => ({ servicesCategories }),
  GET_JOBS_CATEGORIES: (jobsCategories) => ({ jobsCategories }),
  GET_CRYPTO_CATEGORIES: (cryptoCategories) => ({ cryptoCategories }),
});

export {
  getCategories,
  getFeatureList,
  getForSaleList,
  getServicesList,
  getJobsList,
  getRentalsList,
  getCryptoBazaarList,
  getForSaleCategories,
  getServicesCategories,
  getJobsCategories,
  getCryptoCategories
};
