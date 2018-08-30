import {
  takeEvery,
  put,
  all,
  call,
  select
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import electron from 'electron';
import request from 'request-promise-native';

import config from '../../config/config';

import {
  checkUpdate,
  checkUpdateFinish
} from './updateNotificationActions';

export function* updateNotificationSubscriber() {
  yield all([
    takeEvery('CHECK_UPDATE', checkUpdateHandler)
  ]);
}

const checkInterval = 3600000;
const updateServerUrl = config.updateServer;

const isProd = () => process.env.NODE_ENV === 'production';

const checkNewVersion = async (version, platform) => {
  const opts = {
    uri: `${updateServerUrl}/update/wallet/check`,
    qs: {
    	version,
    	platform
    },
    method: 'GET'
  };
  const body = await request(opts);
  return JSON.parse(body);
};

function* checkUpdateHandler() {
  if (!isProd()) {
    return;
  }

  try {
    const currentVersion = (electron.app || electron.remote.app).getVersion();
    const platform = process.platform;
    const { hasUpdate, version, link } = yield checkNewVersion(currentVersion, platform);
    const updateLink = link ? `${updateServerUrl}/${link}` : '';
    yield put(checkUpdateFinish(null, hasUpdate, version, updateLink));
  } catch (err) {
    console.log('Check update error', err);
    yield put(checkUpdateFinish(err));
  } finally {
    yield delay(checkInterval);
    yield put(checkUpdate());
  }
}
