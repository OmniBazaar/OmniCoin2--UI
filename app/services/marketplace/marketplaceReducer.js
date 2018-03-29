import { handleActions, combineActions } from 'redux-actions';
import _ from 'lodash';
import {
  getFeatureList,
  setPaginationFeature,
  setActivePageFeature,
  getForSaleList,
  getNewArrivalsList,
  setPaginationNewArrivals,
  setActivePageNewArrivals,
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
  newArrivalsList: [],
  newArrivalsListFiltered: [],
  activePageNewArrivals: 1,
  totalPagesNewArrivals: 1,
  rowsPerPageNewArrivals: 3 * 6,
  sortDirectionNewArrivals: 'ascending',
  sortColumnNewArrivals: 'date',
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

const getTotalPages = (data, rowsPerPage) => {
  return Math.ceil(data.length / rowsPerPage);
};

const reducer = handleActions({
  [getFeatureList](state, { payload: { featureList } }) {
    return {
      ...state,
      featureList,
      featureListFiltered: featureList
    };
  },
  [combineActions(setPaginationFeature)](state, { payload: { rowsPerPageFeature } }) {
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
  [combineActions(setActivePageFeature)](state, { payload: { activePageFeature } }) {
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
  [getNewArrivalsList](state, { payload: { newArrivalsList } }) {
    const sortedData = _.sortBy(newArrivalsList, ['date']).reverse();

    return {
      ...state,
      newArrivalsList: sortedData,
      newArrivalsListFiltered: sortedData
    };
  },
  [combineActions(setPaginationNewArrivals)](state, { payload: { rowsPerPageNewArrivals } }) {
    const data = state.newArrivalsList;
    const { activePageNewArrivals } = state;
    const totalPagesNewArrivals = getTotalPages(data, rowsPerPageNewArrivals);
    const currentData = sliceData(data, activePageNewArrivals, rowsPerPageNewArrivals);

    return {
      ...state,
      totalPagesNewArrivals,
      rowsPerPageNewArrivals,
      newArrivalsListFiltered: currentData,
    };
  },
  [combineActions(setActivePageNewArrivals)](state, { payload: { activePageNewArrivals } }) {
    const data = state.newArrivalsList;
    if (activePageNewArrivals !== state.activePageNewArrivals) {
      const { rowsPerPageNewArrivals } = state;
      const currentData = sliceData(data, activePageNewArrivals, rowsPerPageNewArrivals);

      return {
        ...state,
        activePageNewArrivals,
        newArrivalsListFiltered: currentData,
      };
    }

    return {
      ...state,
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
