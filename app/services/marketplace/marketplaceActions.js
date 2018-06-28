import { createActions } from 'redux-actions';

const {
  getCategories,
  getFeatureList,
  getForSaleList,
  getServicesList,
  getJobsList,
  getRentalsList,
  getCryptoBazaarList,
  setActiveCategory,
  setPaginationGridTable,
  sortGridTableBy,
  setActivePageGridTable,
  sortDataTableBy,
  ob2SocketOpened,
  ob2SocketClosed
} = createActions({
  GET_CATEGORIES: () => ({}),
  GET_FEATURE_LIST: (featureList) => ({ featureList }),
  SET_PAGINATION_FEATURE: (rowsPerPageFeature) => ({ rowsPerPageFeature }),
  GET_FOR_SALE_LIST: (forSaleList) => ({ forSaleList }),
  GET_SERVICES_LIST: (servicesList) => ({ servicesList }),
  GET_JOBS_LIST: (jobsList) => ({ jobsList }),
  GET_RENTALS_LIST: (rentalsList) => ({ rentalsList }),
  GET_CRYPTO_BAZAAR_LIST: (cryptoBazaarList) => ({ cryptoBazaarList }),
  SET_ACTIVE_CATEGORY: (activeCategory, parentCategory) => ({ activeCategory, parentCategory }),
  SET_PAGINATION_GRID_TABLE: (rowsPerPageGridTable) => ({ rowsPerPageGridTable }),
  SORT_GRID_TABLE_BY: (gridTableData, sortGridBy, sortGridDirection, currency) =>
    ({
      gridTableData,
      sortGridBy,
      sortGridDirection,
      currency
    }),
  SET_ACTIVE_PAGE_GRID_TABLE: (activePageGridTable) => ({ activePageGridTable }),
  SORT_DATA_TABLE_BY: (dataTableData, sortTableBy) => ({ dataTableData, sortTableBy }),
  OB2_SOCKET_OPENED: () => ({}),
  OB2_SOCKET_CLOSED: () => ({})
});

export {
  getCategories,
  getFeatureList,
  getForSaleList,
  getServicesList,
  getJobsList,
  getRentalsList,
  getCryptoBazaarList,
  setActiveCategory,
  setPaginationGridTable,
  sortGridTableBy,
  setActivePageGridTable,
  sortDataTableBy,
  ob2SocketOpened,
  ob2SocketClosed
};
