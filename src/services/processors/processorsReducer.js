import { handleActions, combineActions } from 'redux-actions';
import {
  getStandbyProcessors,
  getTopProcessors,
} from './processorsActions';

let defaultState = {
  standbyProcessors: [],
  topProcessors: [],
};

const reducer = handleActions({
  [combineActions(getStandbyProcessors)](state, { payload: { standbyProcessors } }) {
    return {
      ...state,
      standbyProcessors
    };
  },
  [combineActions(getTopProcessors)](state, { payload: { topProcessors } }) {
    return {
      ...state,
      topProcessors
    };
  },
}, defaultState);

export default reducer;
