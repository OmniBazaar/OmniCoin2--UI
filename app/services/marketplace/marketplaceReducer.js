import { handleActions } from 'redux-actions';
import { defineMessages } from 'react-intl';

import {
  getFeatureList,
  getForSaleList,
  getServicesList,
  getJobsList,
  getRentalsList,
  getCryptoBazaarList,
  getForSaleCategories,
  getServicesCategories,
  getJobsCategories,
  getCryptoCategories,
  getCategories
} from './marketplaceActions';

const defaultState = {
  forSaleCategories: [],
  servicesCategories: [],
  jobsCategories: [],
  cryptoCategories: [],
  featureList: [],
  forSaleList: [],
  servicesList: [],
  jobsList: [],
  rentalsList: [],
  cryptoBazaarList: [],
  categories: {}
};

const messages = defineMessages({
  community: {
    id: 'Categories.community',
    defaultMessage: 'Community'
  },
  housing: {
    id: 'Categories.housing',
    defaultMessage: 'Housing'
  },
  forSale: {
    id: 'Categories.forSale',
    defaultMessage: 'For Sale'
  },
  jobs: {
    id: 'Categories.jobs',
    defaultMessage: 'Jobs'
  },
  services: {
    id: 'Categories.services',
    defaultMessage: 'Services'
  },
  gigs: {
    id: 'Categories.gigs',
    defaultMessage: 'Gigs'
  },
  cryptoBazaar: {
    id: 'Categories.cryptoBazaar',
    defaultMessage: 'CryptoBazaar'
  }
});

const reducer = handleActions({
  [getFeatureList](state, { payload: { featureList } }) {
    return {
      ...state,
      featureList
    };
  },
  [getForSaleList](state, { payload: { forSaleList } }) {
    return {
      ...state,
      forSaleList
    };
  },
  [getServicesList](state, { payload: { servicesList } }) {
    return {
      ...state,
      servicesList
    };
  },
  [getJobsList](state, { payload: { jobsList } }) {
    return {
      ...state,
      jobsList
    };
  },
  [getRentalsList](state, { payload: { rentalsList } }) {
    return {
      ...state,
      rentalsList
    };
  },
  [getCryptoBazaarList](state, { payload: { cryptoBazaarList } }) {
    return {
      ...state,
      cryptoBazaarList
    };
  },
  [getForSaleCategories](state, { payload: { forSaleCategories } }) {
    return {
      ...state,
      forSaleCategories
    };
  },
  [getServicesCategories](state, { payload: { servicesCategories } }) {
    return {
      ...state,
      servicesCategories
    };
  },
  [getJobsCategories](state, { payload: { jobsCategories } }) {
    return {
      ...state,
      jobsCategories
    };
  },
  [getCryptoCategories](state, { payload: { cryptoCategories } }) {
    return {
      ...state,
      cryptoCategories
    };
  },
  [getCategories](state, { payload: { } }) {
    return {
      ...state,
      categories: messages
    };
  }
}, defaultState);

export default reducer;
