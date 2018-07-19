import {
  takeEvery,
  put,
  all,
  call,
  select
} from 'redux-saga/effects';
import { ipcRenderer } from 'electron';

import {
  savePreferencesSuccess,
  savePreferencesError
} from './preferencesActions';
import { storePreferences } from './services';
import { restartNode } from '../blockchain/connection/connectionActions';

export function* preferencesSubscriber() {
  yield all([
    takeEvery('SAVE_PREFERENCES', savePreferences)
  ]);
}

function* savePreferences({ payload: { preferences } }) {
  try {
    yield call(storePreferences, preferences);
    if (preferences.autorun) {
      ipcRenderer.send('launch-node-daemon');
    } else {
      ipcRenderer.send('stop-node-daemon');
    }
    yield put(savePreferencesSuccess(preferences));
    yield put(restartNode()); // bcs the app is still running
  } catch (err) {
    yield put(savePreferencesError(err));
  }
}
