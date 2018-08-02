import {
  takeEvery,
  put,
  all,
  call,
  select
} from 'redux-saga/effects';
import { ipcRenderer } from 'electron';

import {
  loadServerPreferencesSuccess,
  savePreferencesSuccess,
  savePreferencesError
} from './preferencesActions';

import {
  storePreferences,
  getuserPrefereneces
} from './services';
import {
  restartNode
} from "../blockchain/connection/connectionActions";

export function* preferencesSubscriber() {
  yield all([
    takeEvery('SAVE_PREFERENCES', savePreferences),
    takeEvery('LOAD_SERVER_PREFERENCES', loadServerPreferences)
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
  } catch(err) {
    console.log("ERROR", err)
    yield put(savePreferencesError(err));
  }
}

function* loadServerPreferences() {
  const userPrefereneces = yield call(getuserPrefereneces)
  yield put(loadServerPreferencesSuccess(userPrefereneces));
}