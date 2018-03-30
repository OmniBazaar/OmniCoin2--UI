import { handleActions, combineActions } from 'redux-actions';
import _ from 'lodash';
import {
  getHighestPriceList,
  setPaginationHighestPrice,
  setActivePageHighestPrice
} from './highestPriceActions';

const defaultState = {
  highestPriceList: [],
  highestPriceListFiltered: [],
  totalPagesHighestPrice: 1,
  rowsPerPageHighestPrice: 3 * 6,
  activePageHighestPrice: 1,
};

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => Math.ceil(data.length / rowsPerPage);

const reducer = handleActions({
  [getHighestPriceList](state, { payload: { highestPriceList } }) {
    const sortedData = _.sortBy(highestPriceList, ['price']).reverse();

    return {
      ...state,
      highestPriceList: sortedData,
      highestPriceListFiltered: sortedData
    };
  },
  [combineActions(setPaginationHighestPrice)](state, { payload: { rowsPerPageHighestPrice } }) {
    const data = state.highestPriceList;
    const { activePageHighestPrice } = state;
    const totalPagesHighestPrice = getTotalPages(data, rowsPerPageHighestPrice);
    const currentData = sliceData(data, activePageHighestPrice, rowsPerPageHighestPrice);

    return {
      ...state,
      totalPagesHighestPrice,
      rowsPerPageHighestPrice,
      highestPriceListFiltered: currentData,
    };
  },
  [combineActions(setActivePageHighestPrice)](state, { payload: { activePageHighestPrice } }) {
    const data = state.highestPriceList;
    if (activePageHighestPrice !== state.activePageHighestPrice) {
      const { rowsPerPageHighestPrice } = state;
      const currentData = sliceData(data, activePageHighestPrice, rowsPerPageHighestPrice);

      return {
        ...state,
        activePageHighestPrice,
        highestPriceListFiltered: currentData,
      };
    }

    return {
      ...state,
    };
  },
}, defaultState);

export default reducer;
