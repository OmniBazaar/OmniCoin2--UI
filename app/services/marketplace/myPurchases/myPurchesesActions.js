import { createActions } from 'redux-actions';

const {
  getMyPurchases,
  getMyPurchasesSucceeded,
  getMyPurchasesFailed,
  filterData,
  setPagination,
  setActivePage,
  sortData
} = createActions({
  GET_MY_PURCHASES: (from, to) => ({ from, to }),
  GET_MY_PURCHASES_SUCCEEDED: (myPurchases) => ({ myPurchases }),
  GET_MY_PURCHASES_FAILED: (error) => ({ error }),
  FILTER_DATA: (filterText) => ({ filterText }),
  SET_PAGINATION: (rowsPerPage) => ({ rowsPerPage }),
  SET_ACTIVE_PAGE: (activePage) => ({ activePage }),
  SORT_DATA: (sortColumn) => ({ sortColumn }),
});

export {
  getMyPurchases,
  getMyPurchasesSucceeded,
  getMyPurchasesFailed,
  filterData,
  setPagination,
  setActivePage,
  sortData
};
