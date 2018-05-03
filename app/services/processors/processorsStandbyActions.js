import { createActions } from 'redux-actions';

const {
  getStandbyProcessors,
  sortDataStandBy,
  filterDataStandBy,
  setActivePageStandBy,
  setPaginationStandBy,
  toggleProcessor,
  commitProcessors,
  rollbackProcessors
} = createActions({
  GET_STANDBY_PROCESSORS: () => ({ }),
  SORT_DATA_STAND_BY: (sortColumnStandBy) => ({ sortColumnStandBy }),
  FILTER_DATA_STAND_BY: (filterTextStandBy) => ({ filterTextStandBy }),
  SET_ACTIVE_PAGE_STAND_BY: (activePageStandBy) => ({ activePageStandBy }),
  SET_PAGINATION_STAND_BY: (rowsPerPageStandBy) => ({ rowsPerPageStandBy }),
  TOGGLE_PROCESSOR: (processorId) => ({ processorId }),
  COMMIT_PROCESSORS: () => ({}),
  ROLLBACK_PROCESSORS: () => ({})
});

export {
  getStandbyProcessors,
  sortDataStandBy,
  filterDataStandBy,
  setActivePageStandBy,
  setPaginationStandBy,
  toggleProcessor,
  commitProcessors,
  rollbackProcessors
};
