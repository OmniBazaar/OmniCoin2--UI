import { createActions } from 'redux-actions';

const {
  getHighestPriceList,
  setPaginationHighestPrice,
  setActivePageHighestPrice,
} = createActions({
  GET_HIGHEST_PRICE_LIST: (highestPriceList) => ({ highestPriceList }),
  SET_PAGINATION_HIGHEST_PRICE: (rowsPerPageHighestPrice) => ({ rowsPerPageHighestPrice }),
  SET_ACTIVE_PAGE_HIGHEST_PRICE: (activePageHighestPrice) => ({ activePageHighestPrice })
});

export {
  getHighestPriceList,
  setPaginationHighestPrice,
  setActivePageHighestPrice
};
