import { createActions } from 'redux-actions';

const {
  loadPreferences,
  savePreferences,
  savePreferencesSuccess,
  savePreferencesError
} = createActions({
  LOAD_PREFERENCES: () => ({}),
  SAVE_PREFERENCES: (preferences) => ({ preferences }),
  SAVE_PREFERENCES_SUCCESS: (preferences) => ({ preferences }),
  SAVE_PREFERENCES_ERROR: (error) => ({ error })
});

export {
  loadPreferences,
  savePreferences,
  savePreferencesSuccess,
  savePreferencesError
};
