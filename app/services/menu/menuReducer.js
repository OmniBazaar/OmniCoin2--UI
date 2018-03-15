import { handleActions, combineActions } from 'redux-actions';

import {
  showSettingsModal,
  showPreferencesModal
} from './menuActions';

const defaultState = {
  showSettings: false,
  showPreferences: false,
};

const reducer = handleActions({
  [combineActions(showSettingsModal)](state) {
    return {
      ...state,
      showSettings: !state.showSettings
    };
  },
  [combineActions(showPreferencesModal)](state) {
    return {
      ...state,
      showPreferences: !state.showPreferences
    };
  },
}, defaultState);

export default reducer;
