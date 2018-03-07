import { handleActions, combineActions } from 'redux-actions';

import {
  showSettingsModal,
} from './menuActions';

const defaultState = {
  showSettings: false,
};

const reducer = handleActions({
  [combineActions(showSettingsModal)](state, { payload: { showSettings } }) {
    return {
      ...state,
      showSettings: !state.showSettings
    };
  },
}, defaultState);

export default reducer;
