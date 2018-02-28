import { createActions } from 'redux-actions';

const { getStandbyProcessors, getTopProcessors } = createActions({
  GET_STANDBY_PROCESSORS: (standbyProcessors) => ({ standbyProcessors }),
  GET_TOP_PROCESSORS: (topProcessors) => ({ topProcessors }),
});

export {
  getStandbyProcessors,
  getTopProcessors,
}
