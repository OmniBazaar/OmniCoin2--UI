import { createActions } from 'redux-actions';

const {
  getStandbyProcessors,
  sortDataStandBy,
  filterDataStandBy,
  setActivePageStandBy,
  setPaginationStandBy,
  toggleProcessorStandBy,
  commitProcessorsStandBy,
  rollbackProcessorsStandBy
} = createActions({
  GET_STANDBY_PROCESSORS: () => ({ }),
  SORT_DATA_STAND_BY: (sortColumnStandBy) => ({ sortColumnStandBy }),
  FILTER_DATA_STAND_BY: (filterTextStandBy) => ({ filterTextStandBy }),
  SET_ACTIVE_PAGE_STAND_BY: (activePageStandBy) => ({ activePageStandBy }),
  SET_PAGINATION_STAND_BY: (rowsPerPageStandBy) => ({ rowsPerPageStandBy }),
  TOGGLE_PROCESSOR_STAND_BY: (processorId) => ({ processorId }),
  COMMIT_PROCESSORS_STAND_BY: () => ({}),
  ROLLBACK_PROCESSORS_STAND_BY: () => ({})
});

export {
  getStandbyProcessors,
  sortDataStandBy,
  filterDataStandBy,
  setActivePageStandBy,
  setPaginationStandBy,
  toggleProcessorStandBy,
  commitProcessorsStandBy,
  rollbackProcessorsStandBy
};
