import { handleActions } from 'redux-actions';
import { getPreferences as getPreferencesService } from './services';
import {
  loadLocalPreferences,
  loadServerPreferences,
  loadServerPreferencesSuccess,
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
    publisherFee: 0.25,
    escrowFee: 1,
    searchListingOption: 'anyKeyword'
  },
  loading: false,
  saving: false,
  error: null
};

const reducer = handleActions({
  [loadLocalPreferences](state) {
    const data = getPreferencesService();
    return {
      ...state,
      preferences: {
        ...state.preferences,
        ...data
      }
    };
  },
  [loadServerPreferences](state) {
    return {
      ...state,
      loading: true
    }
  },
  [loadServerPreferencesSuccess](state, { payload: { preferences } }) {
    return {
      ...state,
      preferences: {
        ...state.preferences,
        ...preferences
      },
      loading: false
    }
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
