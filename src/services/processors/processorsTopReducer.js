import { handleActions, combineActions } from 'redux-actions';
import _ from 'lodash';

import {
  getTopProcessors,
  sortDataTop,
  filterDataTop,
  setActivePageTop,
  setPaginationTop,
} from './processorsTopActions';

let defaultState = {
  topProcessors: [],
  topProcessorsFiltered: [],
  activePageTop: 1,
  sortDirectionTop: 'descending',
  sortColumnTop: 'rank',
  totalPagesTop: 1,
  rowsPerPageTop: 10,
  filterTextTop: '',
};

const sliceData = (data, activePage, rowsPerPage) => {
  return data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage);
};

const getTotalPages = (data, rowsPerPage) => {
  return Math.ceil(data.length / rowsPerPage);
};

const reducer = handleActions({
  [combineActions(getTopProcessors)](state, { payload: { topProcessors } }) {
    return {
      ...state,
      topProcessors,
      topProcessorsFiltered: topProcessors,
    };
  },
  [combineActions(filterDataTop)](state, { payload: { filterTextTop } }) {
    const data = state.topProcessors;
    const activePageTop = 1;
    const rowsPerPageTop = state.rowsPerPageTop;
    let totalPagesTop = state.totalPagesTop;
    let currentData = [];

    if (filterTextTop !== '') {
      let filteredData = _.map(data, function(o) {
        let values = Object.values(o);
        let result =_.map(values, function(val) {
          if (val) {
            if (val.toString().indexOf(filterTextTop) !== -1) return o;
          }
        });
        return _.without(result, undefined)[0];
      });

      filteredData = _.without(filteredData, undefined);
      totalPagesTop = getTotalPages(filteredData, rowsPerPageTop);
      currentData = sliceData(filteredData, activePageTop, rowsPerPageTop);
    } else {
      currentData = data;
      totalPagesTop = getTotalPages(currentData, rowsPerPageTop);
      currentData = sliceData(currentData, activePageTop, rowsPerPageTop);
    }

    return {
      ...state,
      filterTextTop,
      activePageTop,
      totalPagesTop,
      topProcessorsFiltered: currentData,
    };
  },
  [combineActions(setPaginationTop)](state, { payload: { rowsPerPageTop } }) {
    const data = state.topProcessors;
    const activePageTop = state.activePageTop;
    const totalPagesTop = getTotalPages(data, rowsPerPageTop);
    const currentData = sliceData(data, activePageTop, rowsPerPageTop);

    return {
      ...state,
      totalPagesTop,
      rowsPerPageTop,
      topProcessorsFiltered: currentData,
    };
  },
  [combineActions(setActivePageTop)](state, { payload: { activePageTop } }) {
    const data = state.topProcessors;
    if (activePageTop !== state.activePageTop) {
      const rowsPerPageTop = state.rowsPerPageTop;
      const currentData = sliceData(data, activePageTop, rowsPerPageTop);

      return {
        ...state,
        activePageTop,
        topProcessorsFiltered: currentData,
      };
    } else {
      return {
        ...state,
      }
    }
  },
  [combineActions(sortDataTop)](state, { payload: { sortColumnTop } }) {
    const filterTextTop = state.filterTextTop;
    let sortDirectionTop = state.sortDirectionTop === 'ascending' ? 'descending' : 'ascending';
    let sortByFilter = _.sortBy(state.topProcessorsFiltered, [sortColumnTop]);
    let sortByData = _.sortBy(state.topProcessors, [sortColumnTop]);
    let sortBy = filterTextTop !== '' ? sortByFilter : sortByData;
    let sortedData = [];

    if (state.sortColumnTop !== sortColumnTop) {
      sortedData = sortBy.reverse();
      sortDirectionTop = 'ascending';
    } else {
      sortedData = sortDirectionTop === 'ascending' ? sortBy.reverse() : sortBy;
    }

    const activePageTop = state.activePageTop;
    const rowsPerPageTop = state.rowsPerPageTop;
    const currentData = sliceData(sortedData, activePageTop, rowsPerPageTop);

    return {
      ...state,
      topProcessorsFiltered: currentData,
      sortDirectionTop,
      sortColumnTop,
    };
  },
}, defaultState);

export default reducer;
