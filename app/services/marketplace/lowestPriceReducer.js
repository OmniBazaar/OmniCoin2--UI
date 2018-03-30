import { handleActions, combineActions } from 'redux-actions';
import _ from 'lodash';
import {
  getLowestPriceList,
  setPaginationLowestPrice,
  setActivePageLowestPrice
} from './lowestPriceActions';

const defaultState = {
  lowestPriceList: [],
  lowestPriceListFiltered: [],
  totalPagesLowestPrice: 1,
  rowsPerPageLowestPrice: 3 * 6,
  activePageLowestPrice: 1,
};

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => Math.ceil(data.length / rowsPerPage);

const reducer = handleActions({
  [getLowestPriceList](state, { payload: { lowestPriceList } }) {
    const sortedData = _.sortBy(lowestPriceList, ['price']);

    return {
      ...state,
      lowestPriceList: sortedData,
      lowestPriceListFiltered: sortedData
    };
  },
  [combineActions(setPaginationLowestPrice)](state, { payload: { rowsPerPageLowestPrice } }) {
    const data = state.lowestPriceList;
    const { activePageLowestPrice } = state;
    const totalPagesLowestPrice = getTotalPages(data, rowsPerPageLowestPrice);
    const currentData = sliceData(data, activePageLowestPrice, rowsPerPageLowestPrice);

    return {
      ...state,
      totalPagesLowestPrice,
      rowsPerPageLowestPrice,
      lowestPriceListFiltered: currentData,
    };
  },
  [combineActions(setActivePageLowestPrice)](state, { payload: { activePageLowestPrice } }) {
    const data = state.lowestPriceList;
    if (activePageLowestPrice !== state.activePageLowestPrice) {
      const { rowsPerPageLowestPrice } = state;
      const currentData = sliceData(data, activePageLowestPrice, rowsPerPageLowestPrice);

      return {
        ...state,
        activePageLowestPrice,
        lowestPriceListFiltered: currentData,
      };
    }

    return {
      ...state,
    };
  },
}, defaultState);

export default reducer;
