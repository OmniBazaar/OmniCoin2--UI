import { handleActions } from 'redux-actions';
import {
  getFeatureList,
  getForSaleList,
  getServicesList,
  getJobsList,
  getRentalsList,
  getCryptoBazaarList,
  setActiveCategory
} from './marketplaceActions';

const defaultState = {
  featureList: [],
  forSaleList: [],
  servicesList: [],
  jobsList: [],
  rentalsList: [],
  cryptoBazaarList: [],
  activeCategory: 'Marketplace.home',
  parentCategory: null
};

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
  [setActiveCategory](state, { payload: { activeCategory, parentCategory } }) {
    return {
      ...state,
      activeCategory,
      parentCategory
    };
  }
}, defaultState);

export default reducer;
