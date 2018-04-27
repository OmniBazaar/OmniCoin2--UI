import { handleActions } from 'redux-actions';
import { defineMessages } from 'react-intl';
import _ from 'lodash';

import {
  getFeatureList,
  getForSaleList,
  getServicesList,
  getJobsList,
  getRentalsList,
  getCryptoBazaarList,
  getCategories,
  setActiveCategory,
  getRecentSearches,
  setPaginationGridTable,
  sortGridTableBy,
  setActivePageGridTable,
} from './marketplaceActions';

const defaultState = {
  featureList: [],
  forSaleList: [],
  servicesList: [],
  jobsList: [],
  rentalsList: [],
  cryptoBazaarList: [],
  recentSearches: [],
  categories: {},
  activeCategory: 'Marketplace.home',
  parentCategory: null,
  gridTableData: [],
  gridTableDataFiltered: [],
  activePageGridTable: 1,
  totalPagesGridTable: 1,
  rowsPerPageGridTable: 3 * 6,
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

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => Math.ceil(data.length / rowsPerPage);

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
  },
  [getCategories](state) {
    return {
      ...state,
      categories: messages
    };
  },
  [getRecentSearches](state, { payload: { recentSearches } }) {
    const sortedData = _.sortBy(recentSearches, ['date']).reverse();
    return {
      ...state,
      recentSearches: sortedData
    };
  },

  [setPaginationGridTable](state, { payload: { rowsPerPageGridTable } }) {
    const data = state.gridTableData;
    const { activePageGridTable } = state;
    const totalPagesGridTable = getTotalPages(data, rowsPerPageGridTable);
    const currentData = sliceData(data, activePageGridTable, rowsPerPageGridTable);

    return {
      ...state,
      totalPagesGridTable,
      rowsPerPageGridTable,
      gridTableDataFiltered: currentData,
    };
  },
  [sortGridTableBy](state, { payload: { gridTableData, sortGridBy, sortGridDirection } }) {
    let sortedData = _.sortBy(gridTableData, [sortGridBy]);
    if (sortGridDirection === 'descending') {
      sortedData = sortedData.reverse();
    }

    return {
      ...state,
      gridTableData: sortedData,
      gridTableDataFiltered: sortedData
    };
  },
  [setActivePageGridTable](state, { payload: { activePageGridTable } }) {
    const data = state.gridTableData;
    if (activePageGridTable !== state.activePageGridTable) {
      const { rowsPerPageGridTable } = state;
      const currentData = sliceData(data, activePageGridTable, rowsPerPageGridTable);

      return {
        ...state,
        activePageGridTable,
        gridTableDataFiltered: currentData,
      };
    }

    return {
      ...state,
    };
  },
}, defaultState);

export default reducer;
