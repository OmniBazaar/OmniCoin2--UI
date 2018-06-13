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
  rowsPerPage: 10,
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
    const data = state.myPurchases;
    const activePage = 1;
    let { totalPages } = state;
    const { rowsPerPage } = state;
    let currentData = [];

    if (filterText !== '') {
      let filteredData = _.map(data, (o) => {
        const values = Object.values(o);
        const result = _.map(values, (val) => {
          if (val) {
            if (val.toString().indexOf(filterText) !== -1) return o;
          }
        });
        return _.without(result, undefined)[0];
      });

      filteredData = _.without(filteredData, undefined);
      totalPages = getTotalPages(filteredData, rowsPerPage);
      currentData = sliceData(filteredData, activePage, rowsPerPage);
    } else {
      currentData = data;
      totalPages = getTotalPages(currentData, rowsPerPage);
      currentData = sliceData(currentData, activePage, rowsPerPage);
    }

    return {
      ...state,
      filterText,
      activePage,
      totalPages,
      myPurchases: currentData,
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
    console.log('SORT COLUMN ', sortColumn);
    const { filterText } = state;
    let sortDirection = state.sortDirection === 'ascending' ? 'descending' : 'ascending';
    const sortByFilter = _.sortBy(state.myPurchasesFiltered, [sortColumn]);
    const sortByData = _.sortBy(state.myPurchases, [sortColumn]);
    const sortBy = filterText !== '' ? sortByFilter : sortByData;
    let sortedData = [];

    if (state.sortColumn !== sortColumn) {
      sortedData = sortBy.reverse();
      sortDirection = 'ascending';
    } else {
      sortedData = sortDirection === 'ascending' ? sortBy.reverse() : sortBy;
    }

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
