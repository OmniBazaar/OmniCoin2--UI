import { createActions } from 'redux-actions';

const {
  getLowestPriceList,
  setPaginationLowestPrice,
  setActivePageLowestPrice,
} = createActions({
  GET_LOWEST_PRICE_LIST: (lowestPriceList) => ({ lowestPriceList }),
  SET_PAGINATION_LOWEST_PRICE: (rowsPerPageLowestPrice) => ({ rowsPerPageLowestPrice }),
  SET_ACTIVE_PAGE_LOWEST_PRICE: (activePageLowestPrice) => ({ activePageLowestPrice })
});

export {
  getLowestPriceList,
  setPaginationLowestPrice,
  setActivePageLowestPrice
};
