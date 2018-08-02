import { createActions } from 'redux-actions';

const {
  getMyPurchases,
  getMyPurchasesSucceeded,
  getMyPurchasesFailed,
  getMySellings,
  getMySellingsSucceeded,
  getMySellingsFailed,
  filterData,
  setPagination,
  setActivePage,
  sortData,
  addPurchase,
  addPurchaseSucceeded,
  addPurchaseFailed,
  addSelling,
  addSellingSucceeded,
  addSellingFailed
} = createActions({
  GET_MY_PURCHASES: () => ({ }),
  GET_MY_PURCHASES_SUCCEEDED: (myPurchases) => ({ myPurchases }),
  GET_MY_PURCHASES_FAILED: (error) => ({ error }),
  GET_MY_SELLINGS: () => ({ }),
  GET_MY_SELLINGS_SUCCEEDED: (mySellings) => ({ mySellings }),
  GET_MY_SELLINGS_FAILED: (error) => ({ error }),
  FILTER_DATA: (filterText) => ({ filterText }),
  SET_PAGINATION: (rowsPerPage) => ({ rowsPerPage }),
  SET_ACTIVE_PAGE: (activePage) => ({ activePage }),
  SORT_DATA: (sortColumn) => ({ sortColumn }),
  ADD_PURCHASE: (purchase) => ({ purchase }),
  ADD_PURCHASE_SUCCEEDED: () => ({ }),
  ADD_PURCHASE_FAILED: (error) => ({ error }),
  ADD_SELLING: (selling) => (selling),
  ADD_SELLING_SUCCEEDED: () => ({ }),
  ADD_SELLING_FAILED: (error) => ({ error })
 });

export {
  getMyPurchases,
  getMyPurchasesSucceeded,
  getMyPurchasesFailed,
  getMySellings,
  getMySellingsSucceeded,
  getMySellingsFailed,
  filterData,
  setPagination,
  setActivePage,
  sortData,
  addPurchase,
  addPurchaseSucceeded,
  addPurchaseFailed,
  addSelling,
  addSellingSucceeded,
  addSellingFailed
};
