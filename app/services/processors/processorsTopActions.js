import { createActions } from 'redux-actions';

const {
  getTopProcessors,
  sortDataTop,
  filterDataTop,
  setActivePageTop,
  setPaginationTop
} = createActions({
  GET_TOP_PROCESSORS: (topProcessors) => ({ topProcessors }),
  SORT_DATA_TOP: (sortColumnTop) => ({ sortColumnTop }),
  FILTER_DATA_TOP: (filterTextTop) => ({ filterTextTop }),
  SET_ACTIVE_PAGE_TOP: (activePageTop) => ({ activePageTop }),
  SET_PAGINATION_TOP: (rowsPerPageTop) => ({ rowsPerPageTop }),
});

export {
  getTopProcessors,
  sortDataTop,
  filterDataTop,
  setActivePageTop,
  setPaginationTop,
};
