import {
  put,
  takeEvery,
  select,
  all,
  call
} from 'redux-saga/effects';

import { getConfigFailed, getConfigSucceeded } from './configActions';
import { wrapRequest } from '../utils';

import { configJson } from '../../config/config';

export function* configSubscriber() {
  yield all([
    takeEvery('GET_CONFIG', getConfig)
  ]);
}

function* getConfig() {
  try {
    const config = yield call(wrapRequest(async () => fetch(configJson)));
    yield put(getConfigSucceeded(config));
  } catch (error) {
    console.log('ERROR ', error);
    yield put(getConfigFailed(error));
  }
}
