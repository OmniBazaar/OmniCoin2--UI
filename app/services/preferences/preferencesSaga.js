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
  getPreferences,
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

function* savePreferences({ payload: { preferences, updateNode } }) {
  try {
    const currentReferences = yield call(getPreferences);

    yield call(storePreferences, preferences);
    if (!currentReferences.autorun && preferences.autorun) {
      ipcRenderer.send('launch-node-daemon');
    }
    if (currentReferences.autorun && !preferences.autorun) {
      ipcRenderer.send('stop-node-daemon');
    }
    yield put(savePreferencesSuccess(preferences));
    if (updateNode) {
      yield put(restartNode()); // bcs the app is still running
    }
  } catch(err) {
    console.log("ERROR", err)
    yield put(savePreferencesError(err));
  }
}

function* loadServerPreferences() {
  const userPrefereneces = yield call(getuserPrefereneces)
  yield put(loadServerPreferencesSuccess(userPrefereneces));
}
