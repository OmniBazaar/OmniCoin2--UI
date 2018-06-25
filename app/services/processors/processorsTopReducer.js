import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  getTopProcessors,
  sortDataTop,
  filterDataTop,
  setActivePageTop,
  setPaginationTop,
  toggleProcessorTop,
  commitProcessorsTop,
  rollbackProcessorsTop
} from './processorsTopActions';

const defaultState = {
  topProcessors: [],
  topProcessorsFiltered: [],
  toggledProcessors: [],
  activePageTop: 1,
  sortDirectionTop: 'descending',
  sortColumnTop: 'rank',
  totalPagesTop: 1,
  rowsPerPageTop: 10,
  filterTextTop: '',
  loading: false,
  voting: false,
  error: null
};

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => (
  Math.ceil(data.length / rowsPerPage)
);

const reducer = handleActions({
  [getTopProcessors](state) {
    return {
      ...state,
      loading: true,
      error: null,
      toggledProcessors: [],
      topProcessors: [],
      topProcessorsFiltered: [],
    };
  },
  GET_TOP_PROCESSORS_SUCCEEDED: (state, { topProcessors }) => ({
    ...state,
    topProcessors,
    loading: false
  }),
  GET_TOP_PROCESSORS_FAILED: (state, { error }) => ({
    ...state,
    error,
    loading: false
  }),
  [filterDataTop](state, { payload: { filterTextTop } }) {
    const data = state.topProcessors;
    const activePageTop = 1;
    const { rowsPerPageTop, totalPagesTop } = state;
    let totalPages = totalPagesTop;
    let currentData = [];
    if (filterTextTop !== '') {
      let filteredData = _.map(data, (o) => {
        const values = Object.values(o);
        const result = _.map(values, (val) => {
          if (val) {
            if (JSON.stringify(val).indexOf(filterTextTop) !== -1) return o;
          }
        });
        return _.without(result, undefined)[0];
      });

      filteredData = _.without(filteredData, undefined);
      totalPages = getTotalPages(filteredData, rowsPerPageTop);
      currentData = sliceData(filteredData, activePageTop, rowsPerPageTop);
    } else {
      currentData = data;
      totalPages = getTotalPages(currentData, rowsPerPageTop);
      currentData = sliceData(currentData, activePageTop, rowsPerPageTop);
    }

    return {
      ...state,
      filterTextTop,
      activePageTop,
      totalPagesTop: totalPages,
      topProcessorsFiltered: currentData,
    };
  },
  [setPaginationTop](state, { payload: { rowsPerPageTop } }) {
    const data = state.topProcessors;
    const { activePageTop } = state;
    const totalPagesTop = getTotalPages(data, rowsPerPageTop);
    const currentData = sliceData(data, activePageTop, rowsPerPageTop);
    return {
      ...state,
      totalPagesTop,
      rowsPerPageTop,
      topProcessorsFiltered: currentData,
    };
  },
  [setActivePageTop](state, { payload: { activePageTop } }) {
    const data = state.topProcessors;
    if (activePageTop !== state.activePageTop) {
      const {
        rowsPerPageTop,
        filterTextTop,
        sortColumnTop,
        sortDirectionTop
      } = state;
      const sortByFilter = _.sortBy(
        state.topProcessorsFiltered,
        [`witness_account[${sortColumnTop}]`]
      );
      const sortByData = _.sortBy(
        data,
        [`witness_account[${sortColumnTop}]`]
      );
      const sortBy = filterTextTop !== '' ? sortByFilter : sortByData;
      let sortedData = [];

      if (state.sortColumnTop !== sortColumnTop) {
        sortedData = sortBy.reverse();
      } else {
        sortedData = sortDirectionTop === 'ascending' ? sortBy.reverse() : sortBy;
      }

      const currentData = sliceData(sortedData, activePageTop, rowsPerPageTop);

      return {
        ...state,
        activePageTop,
        topProcessorsFiltered: currentData,
      };
    }

    return {
      ...state,
    };
  },
  [sortDataTop](state, { payload: { sortColumnTop } }) {
    const { filterTextTop } = state;
    let sortDirectionTop = state.sortDirectionTop === 'ascending' ? 'descending' : 'ascending';
    const sortByFilter = _.sortBy(
      state.topProcessorsFiltered,
      [`witness_account[${sortColumnTop}]`]
    );
    const sortByData = _.sortBy(
      state.topProcessors,
      [`witness_account[${sortColumnTop}]`]
    );
    const sortBy = filterTextTop !== '' ? sortByFilter : sortByData;
    let sortedData = [];

    if (state.sortColumnTop !== sortColumnTop) {
      sortedData = sortBy.reverse();
      sortDirectionTop = 'ascending';
    } else {
      sortedData = sortDirectionTop === 'ascending' ? sortBy.reverse() : sortBy;
    }

    const { activePageTop, rowsPerPageTop } = state;
    const currentData = sliceData(sortedData, activePageTop, rowsPerPageTop);

    return {
      ...state,
      topProcessorsFiltered: currentData,
      sortDirectionTop,
      sortColumnTop,
    };
  },
  [toggleProcessorTop](state, { payload: { processorId } }) {
    let tp = state.toggledProcessors;
    if (state.toggledProcessors.includes(processorId)) {
      tp = _.without(state.toggledProcessors, processorId);
    } else {
      tp = _.union(state.toggledProcessors, [processorId]);
    }
    return {
      ...state,
      toggledProcessors: tp,
      topProcessors: state.topProcessors.map(processor => {
        if (processor.id === processorId) {
          processor.approve = !processor.approve;
        }
        return processor;
      }),
    };
  },
  [commitProcessorsTop](state) {
    return {
      ...state,
      voting: true,
      error: null
    };
  },
  COMMIT_TOP_PROCESSORS_SUCCEEDED(state) {
    return {
      ...state,
      voting: false,
      error: null,
      toggledProcessors: []
    };
  },
  COMMIT_TOP_PROCESSORS_FAILED(state, { error }) {
    return {
      ...state,
      voting: false,
      error
    };
  },
  [rollbackProcessorsTop](state) {
    return {
      ...state,
      topProcessors: state.topProcessors.map(processor => {
        if (state.toggledProcessors.includes(processor.id)) {
          processor.approve = !processor.approve;
        }
        return processor;
      }),
      toggledProcessors: []
    };
  }
}, defaultState);

export default reducer;
