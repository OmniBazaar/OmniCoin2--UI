import { createActions } from 'redux-actions';

const {
  loadLocalPreferences,
  loadServerPreferences,
  loadServerPreferencesSuccess,
  savePreferences,
  savePreferencesSuccess,
  savePreferencesError
} = createActions({
  LOAD_LOCAL_PREFERENCES: () => ({}),
  LOAD_SERVER_PREFERENCES: () => ({}),
  LOAD_SERVER_PREFERENCES_SUCCESS: (preferences) => ({ preferences }),
  SAVE_PREFERENCES: (preferences, updateNode) => ({ preferences, updateNode }),
  SAVE_PREFERENCES_SUCCESS: (preferences) => ({ preferences }),
  SAVE_PREFERENCES_ERROR: (error) => ({ error })
});

export {
  loadLocalPreferences,
  loadServerPreferences,
  loadServerPreferencesSuccess,
  savePreferences,
  savePreferencesSuccess,
  savePreferencesError
};
