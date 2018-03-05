import { handleActions, combineActions } from 'redux-actions';
import _ from 'lodash';

import {
  getStandbyProcessors,
  sortDataStandBy,
  filterDataStandBy,
  setActivePageStandBy,
  setPaginationStandBy,
} from './processorsStandbyActions';

let defaultState = {
  standbyProcessors: [],
  standbyProcessorsFiltered: [],
  activePageStandBy: 1,
  sortDirectionStandBy: 'descending',
  sortColumnStandBy: 'rank',
  totalPagesStandBy: 1,
  rowsPerPageStandBy: 10,
  filterTextStandBy: '',
};

const sliceData = (data, activePage, rowsPerPage) => {
  return data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage);
};

const getTotalPages = (data, rowsPerPage) => {
  return Math.ceil(data.length / rowsPerPage);
};

const reducer = handleActions({
  [combineActions(getStandbyProcessors)](state, { payload: { standbyProcessors } }) {
    return {
      ...state,
      standbyProcessors
    };
  },
  [combineActions(setPaginationStandBy)](state, { payload: { rowsPerPageStandBy } }) {
    const data = state.standbyProcessors;
    const activePageStandBy = state.activePageStandBy;
    const totalPagesStandBy = getTotalPages(data, rowsPerPageStandBy);
    const currentData = sliceData(data, activePageStandBy, rowsPerPageStandBy);

    return {
      ...state,
      totalPagesStandBy,
      rowsPerPageStandBy,
      standbyProcessorsFiltered: currentData,
    };
  },
  [combineActions(filterDataStandBy)](state, { payload: { filterTextStandBy } }) {
    const data = state.standbyProcessors;
    const activePageStandBy = 1;
    const rowsPerPageStandBy = state.rowsPerPageStandBy;
    let totalPagesStandBy = state.totalPagesStandBy;
    let currentData = [];

    if (filterTextStandBy !== '') {
      let filteredData = _.map(data, function(o) {
        let values = Object.values(o);
        let result =_.map(values, function(val) {
          if (val) {
            if (val.toString().indexOf(filterTextStandBy) !== -1) return o;
          }
        });
        return _.without(result, undefined)[0];
      });

      filteredData = _.without(filteredData, undefined);
      totalPagesStandBy = getTotalPages(filteredData, rowsPerPageStandBy);
      currentData = sliceData(filteredData, activePageStandBy, rowsPerPageStandBy);
    } else {
      currentData = data;
      totalPagesStandBy = getTotalPages(currentData, rowsPerPageStandBy);
      currentData = sliceData(currentData, activePageStandBy, rowsPerPageStandBy);
    }

    return {
      ...state,
      filterTextStandBy,
      activePageStandBy,
      totalPagesStandBy,
      standbyProcessorsFiltered: currentData,
    };
  },
  [combineActions(setPaginationStandBy)](state, { payload: { rowsPerPageStandBy } }) {
    const data = state.standbyProcessors;
    const activePageStandBy = state.activePageStandBy;
    const totalPagesStandBy = getTotalPages(data, rowsPerPageStandBy);
    const currentData = sliceData(data, activePageStandBy, rowsPerPageStandBy);

    return {
      ...state,
      totalPagesStandBy,
      rowsPerPageStandBy,
      standbyProcessorsFiltered: currentData,
    };
  },
  [combineActions(setActivePageStandBy)](state, { payload: { activePageStandBy } }) {
    const data = state.standbyProcessors;
    if (activePageStandBy !== state.activePageStandBy) {
      const rowsPerPageStandBy = state.rowsPerPageStandBy;
      const currentData = sliceData(data, activePageStandBy, rowsPerPageStandBy);

      return {
        ...state,
        activePageStandBy,
        standbyProcessorsFiltered: currentData,
      };
    } else {
      return {
        ...state,
      }
    }
  },
  [combineActions(sortDataStandBy)](state, { payload: { sortColumnStandBy } }) {
    const filterTextStandBy = state.filterTextStandBy;
    let sortDirectionStandBy = state.sortDirectionStandBy === 'ascending' ? 'descending' : 'ascending';
    let sortByFilter = _.sortBy(state.standbyProcessorsFiltered, [sortColumnStandBy]);
    let sortByData = _.sortBy(state.standbyProcessors, [sortColumnStandBy]);
    let sortBy = filterTextStandBy !== '' ? sortByFilter : sortByData;
    let sortedData = [];

    if (state.sortColumnStandBy !== sortColumnStandBy) {
      sortedData = sortBy.reverse();
      sortDirectionStandBy = 'ascending';
    } else {
      sortedData = sortDirectionStandBy === 'ascending' ? sortBy.reverse() : sortBy;
    }

    const activePageStandBy = state.activePageStandBy;
    const rowsPerPageStandBy = state.rowsPerPageStandBy;
    const currentData = sliceData(sortedData, activePageStandBy, rowsPerPageStandBy);

    return {
      ...state,
      standbyProcessorsFiltered: currentData,
      sortDirectionStandBy,
      sortColumnStandBy,
    };
  },
}, defaultState);

export default reducer;
