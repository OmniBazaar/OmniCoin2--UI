import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  getMyPurchases,
  getMyPurchasesFailed,
  getMyPurchasesSucceeded,
  getMySellings,
  getMySellingsFailed,
  getMySellingsSucceeded,
  filterData,
  sortData,
  setActivePage,
  setPagination
} from './myPurchasesActions';

const defaultState = {
  data: [],
  dataFiltered: [],
  sortDirection: 'descending',
  sortColumn: 'id',
  activePage: 1,
  totalPages: 1,
  rowsPerPage: 20,
  filterText: '',
  loading: false,
  error: null
};

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => (
  Math.ceil(data.length / rowsPerPage)
);

const reducer = handleActions({
  [getMyPurchases](state) {
    return {
      ...state,
      loading: true,
      error: null
    };
  },
  [getMyPurchasesSucceeded](state, { payload: { myPurchases } }) {
    const orderedPurchases = _.orderBy(myPurchases, ['date'], ['desc']);
    return {
      ...state,
      data: orderedPurchases,
      loading: false,
    };
  },
  [getMyPurchasesFailed](state, { payload: { error } }) {
    return {
      ...state,
      loading: false,
      error
    };
  },
  [getMySellings](state) {
    return {
      ...state,
      loading: true,
      error: null
    };
  },
  [getMySellingsSucceeded](state, { payload: { mySellings } }) {
    const orderedSellings = _.orderBy(mySellings, ['date'], ['desc']);
    return {
      ...state,
      data: orderedSellings,
      loading: false,
    };
  },
  [getMySellingsFailed](state, { payload: { error } }) {
    return {
      ...state,
      loading: false,
      error
    };
  },
  [filterData](state, { payload: { filterText } }) {
    const activePage = 1;
    const { rowsPerPage } = state;
    let filteredData = state.data;
    if (filterText) {
      filteredData = filteredData.filter(el => JSON.stringify(el).indexOf(filterText) !== -1);
    }
    const totalPages = getTotalPages(filteredData, rowsPerPage);
    const currentData = sliceData(filteredData, activePage, rowsPerPage);
    return {
      ...state,
      filterText,
      activePage,
      totalPages,
      dataFiltered: currentData,
    };
  },
  [setPagination](state, { payload: { rowsPerPage } }) {
    const data = state.data;
    const { activePage } = state;
    const totalPages = getTotalPages(data, rowsPerPage);
    const currentData = sliceData(data, activePage, rowsPerPage);
    return {
      ...state,
      totalPages,
      rowsPerPage,
      dataFiltered: currentData,
    };
  },
  [setActivePage](state, { payload: { activePage } }) {
    const data = state.data;
    if (activePage !== state.activePage) {
      const { rowsPerPage } = state;
      const currentData = sliceData(data, activePage, rowsPerPage);

      return {
        ...state,
        activePage,
        dataFiltered: currentData,
      };
    }

    return {
      ...state,
    };
  },
  [sortData](state, { payload: { sortColumn } }) {
    const { filterText } = state;
    const sortDirection = state.sortDirection === 'ascending' ? 'descending' : 'ascending';
    let data = state.data;
    if (filterText) {
      data = data.filter(el => JSON.stringify(el).indexOf(filterText) !== -1);
    }
    const sortedData = _.orderBy(data, [sortColumn], [sortDirection === 'ascending' ? 'asc' : 'desc']);
    const { activePage, rowsPerPage } = state;
    const currentData = sliceData(sortedData, activePage, rowsPerPage);

    return {
      ...state,
      dataFiltered: currentData,
      sortDirection,
      sortColumn,
    };
  },
}, defaultState);

export default reducer;
