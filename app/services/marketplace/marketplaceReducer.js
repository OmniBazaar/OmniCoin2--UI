import { handleActions } from 'redux-actions';
import { defineMessages } from 'react-intl';
import _ from 'lodash';
import { currencyConverter } from '../utils';

import {
  getFeatureList,
  getForSaleList,
  getServicesList,
  getJobsList,
  getRentalsList,
  getCryptoBazaarList,
  getCategories,
  setActiveCategory,
  setPaginationGridTable,
  sortGridTableBy,
  setActivePageGridTable,
  sortDataTableBy
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
  dataTableData: [],
  sortTableBy: 'start_date',
  sortTableDirection: 'descending'
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
  [sortGridTableBy](state, {
    payload: {
      gridTableData,
      sortGridBy,
      sortGridDirection,
      currency
    }
  }) {
    let gridData = gridTableData || [];
    let sortBy = sortGridBy;

    if (sortGridBy === 'price') {
      sortBy = 'convertedPrice';
      const convertTo = (currency && currency === 'ALL') ? 'USD' : currency;
      gridData = gridData.map((item) => {
        const newItem = { ...item };
        newItem.convertedPrice = currencyConverter(item.price, item.currency, convertTo);
        return newItem;
      });
    }

    let sortedData = _.sortBy(gridData, [sortBy]);
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
  [sortDataTableBy](state, { payload: { dataTableData, sortTableBy } }) {
    let sortDirection = state.sortTableDirection === 'ascending' ? 'descending' : 'ascending';

    const sortBy = _.sortBy(dataTableData, [sortTableBy]);
    let sortedData = [];

    if (state.sortTableBy !== sortTableBy) {
      sortedData = sortBy.reverse();
      sortDirection = 'ascending';
    } else {
      sortedData = sortDirection === 'ascending' ? sortBy.reverse() : sortBy;
    }

    return {
      ...state,
      dataTableData: sortedData,
      sortTableDirection: sortDirection,
      sortTableBy,
    };
  },
}, defaultState);

export default reducer;
