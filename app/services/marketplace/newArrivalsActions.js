import { createActions } from 'redux-actions';

const {
  getNewArrivalsList,
  setPaginationNewArrivals,
  setActivePageNewArrivals,
} = createActions({
  GET_NEW_ARRIVALS_LIST: (newArrivalsList) => ({ newArrivalsList }),
  SET_PAGINATION_NEW_ARRIVALS: (rowsPerPageNewArrivals) => ({ rowsPerPageNewArrivals }),
  SET_ACTIVE_PAGE_NEW_ARRIVALS: (activePageNewArrivals) => ({ activePageNewArrivals }),
});

export {
  getNewArrivalsList,
  setPaginationNewArrivals,
  setActivePageNewArrivals,
};
