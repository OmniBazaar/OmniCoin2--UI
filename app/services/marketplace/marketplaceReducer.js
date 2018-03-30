import { handleActions } from 'redux-actions';
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
  getCategoriesList
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
};

const messages = {

}

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
  [getCategoriesList](state, { payload: { } }) {
    return {
      ...state
    }
  }
}, defaultState);

export default reducer;
