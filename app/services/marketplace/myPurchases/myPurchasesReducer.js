import { handleActions } from 'redux-actions';

import {
  getMyPurchases,
  getMyPurchasesFailed,
  getMyPurchasesSucceeded,
  filterData,
  sortData,
  setActivePage,
  setPagination
} from "./myPurchesesActions";

const defaultState = {
  myPurchases: [],
  myPurchasesFiltered: [],
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
  [getMyPurchases](state, { payload: { from, to } }) {
    return {
      ...state,
      loading: true,
      error: null
    }
  },
  [getMyPurchasesSucceeded](state, { payload: { myPurchases } }) {
    return {
      ...state,
      myPurchases,
      loading: false,
    }
  },
  [getMyPurchasesFailed](state, { payload: { error } }) {
    return {
      ...state,
      loading: false,
      error
    }
  },
  [filterData](state, { payload: { filterText } }) {
    const activePage = 1;
    const { rowsPerPage } = state;
    let filteredData = state.myPurchases;
    if (filterText) {
      filteredData = filteredData.filter(el => JSON.stringify(el).indexOf(filterText) !== -1)
    }
    const totalPages = getTotalPages(filteredData, rowsPerPage);
    const currentData = sliceData(filteredData, activePage, rowsPerPage);
    return {
      ...state,
      filterText,
      activePage,
      totalPages,
      myPurchasesFiltered: currentData,
    };
  },
  [setPagination](state, { payload: { rowsPerPage } }) {
    const data = state.myPurchases;
    const { activePage } = state;
    const totalPages = getTotalPages(data, rowsPerPage);
    const currentData = sliceData(data, activePage, rowsPerPage);
    return {
      ...state,
      totalPages,
      rowsPerPage,
      myPurchasesFiltered: currentData,
    };
  },
  [setActivePage](state, { payload: { activePage } }) {
    const data = state.myPurchases;
    if (activePage !== state.activePage) {
      const { rowsPerPage } = state;
      const currentData = sliceData(data, activePage, rowsPerPage);

      return {
        ...state,
        activePage,
        myPurchasesFiltered: currentData,
      };
    }

    return {
      ...state,
    };
  },
  [sortData](state, { payload: { sortColumn } }) {
    const { filterText } = state;
    let sortDirection = state.sortDirection === 'ascending' ? 'descending' : 'ascending';
    let data = state.myPurchases;
    if (!!filterText) {
      data = data.filter(el => JSON.stringify(el).indexOf(filterText) !== -1)
    }
    const sortedData = _.orderBy(data, [sortColumn], [sortDirection === 'ascending' ? 'asc' : 'desc']);
    const { activePage, rowsPerPage } = state;
    const currentData = sliceData(sortedData, activePage, rowsPerPage);

    return {
      ...state,
      myPurchasesFiltered: currentData,
      sortDirection,
      sortColumn,
    };
  },
}, defaultState);

export default reducer;
