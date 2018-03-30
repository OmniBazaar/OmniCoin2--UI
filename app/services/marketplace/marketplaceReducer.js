import { handleActions } from 'redux-actions';
import {
  getFeatureList,
  setPaginationFeature,
  setActivePageFeature,
  getForSaleList,
  getServicesList,
  getJobsList,
  getRentalsList,
  getCryptoBazaarList,
  setActiveCategory,
} from './marketplaceActions';

const defaultState = {
  featureList: [],
  featureListFiltered: [],
  activePageFeature: 1,
  totalPagesFeature: 1,
  rowsPerPageFeature: 3 * 6,
  forSaleList: [],
  servicesList: [],
  jobsList: [],
  rentalsList: [],
  cryptoBazaarList: [],
  activeCategory: 'Marketplace.home',
  parentCategory: null
};

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => Math.ceil(data.length / rowsPerPage);

const reducer = handleActions({
  [getFeatureList](state, { payload: { featureList } }) {
    return {
      ...state,
      featureList,
      featureListFiltered: featureList
    };
  },
  [setPaginationFeature](state, { payload: { rowsPerPageFeature } }) {
    const data = state.featureList;
    const { activePageFeature } = state;
    const totalPagesFeature = getTotalPages(data, rowsPerPageFeature);
    const currentData = sliceData(data, activePageFeature, rowsPerPageFeature);

    return {
      ...state,
      totalPagesFeature,
      rowsPerPageFeature,
      featureListFiltered: currentData,
    };
  },
  [setActivePageFeature](state, { payload: { activePageFeature } }) {
    const data = state.featureList;
    if (activePageFeature !== state.activePageFeature) {
      const { rowsPerPageFeature } = state;
      const currentData = sliceData(data, activePageFeature, rowsPerPageFeature);

      return {
        ...state,
        activePageFeature,
        featureListFiltered: currentData,
      };
    }

    return {
      ...state,
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
