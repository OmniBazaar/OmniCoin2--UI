import {
  takeEvery,
  put,
  all,
  call,
  select
} from 'redux-saga/effects';

import {
  savePreferencesSuccess,
  savePreferencesError
} from './preferencesActions';
import {
  storePreferences
} from './services';

export function* preferencesSubscriber() {
  yield all([
    takeEvery('SAVE_PREFERENCES', savePreferences)
  ]);
}

function* savePreferences({ payload: { preferences } }) {
  try {
    yield call(storePreferences, preferences);
    yield put(savePreferencesSuccess(preferences));
  } catch(err) {
    yield put(savePreferencesError(err));
  }
}