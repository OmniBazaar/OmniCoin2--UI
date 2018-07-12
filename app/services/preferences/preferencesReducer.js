import { handleActions } from 'redux-actions';
import { getPreferences as getPreferencesService } from './services';
import {
  loadPreferences,
  savePreferences,
  savePreferencesSuccess,
  savePreferencesError
} from './preferencesActions';

const defaultState = {
  preferences: {
    logoutTimeout: 30,
    transactionFee: 20,
    vote: 'all',
    language: 'en',
    isReferrer: false,
    listingPriority: 'normal',
    chargeFee: 0.25,
    searchListingOption: 'anyKeyword'
  },
  saving: false,
  error: null
};

const reducer = handleActions({
  [loadPreferences](state) {
    const data = getPreferencesService();
    return {
      ...state,
      preferences: {
        ...state.preferences,
        ...data
      }
    };
  },
  [savePreferences](state) {
    return {
      ...state,
      saving: true,
      error: null
    };
  },
  [savePreferencesSuccess](state, { payload: { preferences } }) {
    return {
      ...state,
      preferences: {
        ...state.preferences,
        ...preferences
      },
      saving: false,
      error: null
    };
  },
  [savePreferencesError](state, { payload: { error } }) {
    return {
      ...state,
      saving: false,
      error
    };
  }
}, defaultState);

export default reducer;
