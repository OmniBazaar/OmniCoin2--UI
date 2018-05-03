import { handleActions, combineActions } from 'redux-actions';
import _ from 'lodash';

import {
  getStandbyProcessors,
  sortDataStandBy,
  filterDataStandBy,
  setActivePageStandBy,
  setPaginationStandBy,
  toggleProcessor
} from './processorsStandbyActions';

const defaultState = {
  standbyProcessors: [],
  standbyProcessorsFiltered: [],
  toggledProcessorsIds: [],
  activePageStandBy: 1,
  sortDirectionStandBy: 'descending',
  sortColumnStandBy: 'rank',
  totalPagesStandBy: 1,
  rowsPerPageStandBy: 10,
  filterTextStandBy: '',
  loading: false,
  error: null
};

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => (
  Math.ceil(data.length / rowsPerPage)
);

const reducer = handleActions({
  [getStandbyProcessors](state) {
    return {
      ...state,
      loading: true,
      error: null
    };
  },
  GET_STANDBY_PROCESSORS_SUCCEEDED: (state, { standbyProcessors }) => {
    return {
      ...state,
      standbyProcessors,
      loading: false
    }
  },
  GET_TOP_PROCESSORS_FAILED: (state, { error }) => {
    return {
      ...state,
      error,
      loading: false
    }
  },
  [toggleProcessor](state, { payload: { processorId }}) {
    return {
      ...state,
    }
  },
  [setPaginationStandBy](state, { payload: { rowsPerPageStandBy } }) {
    const data = state.standbyProcessors;
    const { activePageStandBy } = state;
    const totalPagesStandBy = getTotalPages(data, rowsPerPageStandBy);
    const currentData = sliceData(data, activePageStandBy, rowsPerPageStandBy);

    return {
      ...state,
      totalPagesStandBy,
      rowsPerPageStandBy,
      standbyProcessorsFiltered: currentData,
    };
  },
  [filterDataStandBy](state, { payload: { filterTextStandBy } }) {
    const data = state.standbyProcessors;
    const activePageStandBy = 1;
    const { rowsPerPageStandBy, totalPagesStandBy } = state;
    let totalPages = totalPagesStandBy;
    let currentData = [];

    if (filterTextStandBy !== '') {
      let filteredData = _.map(data, (o) => {
        const values = Object.values(o);
        const result = _.map(values, (val) => {
          if (val) {
            if (val.toString().indexOf(filterTextStandBy) !== -1) return o;
          }
        });
        return _.without(result, undefined)[0];
      });

      filteredData = _.without(filteredData, undefined);
      totalPages = getTotalPages(filteredData, rowsPerPageStandBy);
      currentData = sliceData(filteredData, activePageStandBy, rowsPerPageStandBy);
    } else {
      currentData = data;
      totalPages = getTotalPages(currentData, rowsPerPageStandBy);
      currentData = sliceData(currentData, activePageStandBy, rowsPerPageStandBy);
    }

    return {
      ...state,
      filterTextStandBy,
      activePageStandBy,
      totalPagesStandBy: totalPages,
      standbyProcessorsFiltered: currentData,
    };
  },
  [setPaginationStandBy](state, { payload: { rowsPerPageStandBy } }) {
    const data = state.standbyProcessors;
    const { activePageStandBy } = state;
    const totalPagesStandBy = getTotalPages(data, rowsPerPageStandBy);
    const currentData = sliceData(data, activePageStandBy, rowsPerPageStandBy);

    return {
      ...state,
      totalPagesStandBy,
      rowsPerPageStandBy,
      standbyProcessorsFiltered: currentData,
    };
  },
  [setActivePageStandBy](state, { payload: { activePageStandBy } }) {
    const data = state.standbyProcessors;
    if (activePageStandBy !== state.activePageStandBy) {
      const { rowsPerPageStandBy } = state;
      const currentData = sliceData(data, activePageStandBy, rowsPerPageStandBy);

      return {
        ...state,
        activePageStandBy,
        standbyProcessorsFiltered: currentData,
      };
    }

    return {
      ...state,
    };
  },
  [sortDataStandBy](state, { payload: { sortColumnStandBy } }) {
    const { filterTextStandBy } = state;
    let sortDirectionStandBy = state.sortDirectionStandBy === 'ascending' ? 'descending' : 'ascending';
    const sortByFilter = _.sortBy(state.standbyProcessorsFiltered,
      [sortColumnStandBy !== 'name' ? sortColumnStandBy : 'witness_account.name']
    );
    const sortByData = _.sortBy(state.standbyProcessors,
      [sortColumnStandBy !== 'name' ? sortColumnStandBy : 'witness_account.name']
    );
    const sortBy = filterTextStandBy !== '' ? sortByFilter : sortByData;
    let sortedData = [];

    if (state.sortColumnStandBy !== sortColumnStandBy) {
      sortedData = sortBy.reverse();
      sortDirectionStandBy = 'ascending';
    } else {
      sortedData = sortDirectionStandBy === 'ascending' ? sortBy.reverse() : sortBy;
    }

    const { activePageStandBy, rowsPerPageStandBy } = state;
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
