import { createActions } from 'redux-actions';

const {
  getTopProcessors,
  sortDataTop,
  filterDataTop,
  setActivePageTop,
  setPaginationTop,
  toggleProcessorTop,
  commitProcessorsTop,
  rollbackProcessorsTop
} = createActions({
  GET_TOP_PROCESSORS: () => ({}),
  SORT_DATA_TOP: (sortColumnTop) => ({ sortColumnTop }),
  FILTER_DATA_TOP: (filterTextTop) => ({ filterTextTop }),
  SET_ACTIVE_PAGE_TOP: (activePageTop) => ({ activePageTop }),
  SET_PAGINATION_TOP: (rowsPerPageTop) => ({ rowsPerPageTop }),
  TOGGLE_PROCESSOR_TOP: (processorId) => ({ processorId }),
  COMMIT_PROCESSORS_TOP: () => ({}),
  ROLLBACK_PROCESSORS_TOP: () => ({})
});

export {
  getTopProcessors,
  sortDataTop,
  filterDataTop,
  setActivePageTop,
  setPaginationTop,
  toggleProcessorTop,
  commitProcessorsTop,
  rollbackProcessorsTop
};
