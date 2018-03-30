import { handleActions } from 'redux-actions';
import _ from 'lodash';
import {
  getNewArrivalsList,
  setPaginationNewArrivals,
  setActivePageNewArrivals,
} from './newArrivalsActions';

const defaultState = {
  newArrivalsList: [],
  newArrivalsListFiltered: [],
  activePageNewArrivals: 1,
  totalPagesNewArrivals: 1,
  rowsPerPageNewArrivals: 3 * 6,
};

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => Math.ceil(data.length / rowsPerPage);

const reducer = handleActions({
  [getNewArrivalsList](state, { payload: { newArrivalsList } }) {
    const sortedData = _.sortBy(newArrivalsList, ['date']).reverse();

    return {
      ...state,
      newArrivalsList: sortedData,
      newArrivalsListFiltered: sortedData
    };
  },
  [setPaginationNewArrivals](state, { payload: { rowsPerPageNewArrivals } }) {
    const data = state.newArrivalsList;
    const { activePageNewArrivals } = state;
    const totalPagesNewArrivals = getTotalPages(data, rowsPerPageNewArrivals);
    const currentData = sliceData(data, activePageNewArrivals, rowsPerPageNewArrivals);

    return {
      ...state,
      totalPagesNewArrivals,
      rowsPerPageNewArrivals,
      newArrivalsListFiltered: currentData,
    };
  },
  [setActivePageNewArrivals](state, { payload: { activePageNewArrivals } }) {
    const data = state.newArrivalsList;
    if (activePageNewArrivals !== state.activePageNewArrivals) {
      const { rowsPerPageNewArrivals } = state;
      const currentData = sliceData(data, activePageNewArrivals, rowsPerPageNewArrivals);

      return {
        ...state,
        activePageNewArrivals,
        newArrivalsListFiltered: currentData,
      };
    }

    return {
      ...state,
    };
  },
}, defaultState);

export default reducer;
