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

import { makeRequest } from '../listing/apis';

import {
  publisherCheckUpdate,
  publisherCheckUpdateFinish
} from './publisherUpdateNotificationActions';

export function* publisherUpdateNotificationSubscriber() {
  yield all([
    takeEvery('PUBLISHER_CHECK_UPDATE', checkUpdateHandler)
  ]);
}

const checkInterval = 3600000;
const updateServerUrl = config.updateServer;

const isProd = () => process.env.NODE_ENV === 'production';

const checkNewVersion = async (version, platform) => {
  const opts = {
    uri: `${updateServerUrl}/update/publisher/check`,
    qs: {
    	version,
    	platform
    },
    method: 'GET'
  };
  const body = await request(opts);
  return JSON.parse(body);
};

const getCurrentVersion = async (user, publisherIp) => {
  const publisher = {
    publisher_ip: publisherIp
  };
  const body = await makeRequest(user, publisher, 'version');
  return JSON.parse(body);
}

function* checkUpdateHandler() {
  if (!isProd()) {
    return;
  }

  try {
    const { account } = (yield select()).default;
    if (!account.publisher || !account.ipAddress) {
      return;
    }

    const { currentUser } = (yield select()).default.auth;
    const versionResponse = yield call(getCurrentVersion, currentUser, account.ipAddress);
    if (!versionResponse) {
      throw new Error('Cannot get current publisher version');
    }

    const currentVersion = versionResponse.version;
    const platform = versionResponse.platform;
    if (!currentVersion || !platform) {
      throw new Error('Current publisher version not correct');
    }

    const { hasUpdate, version, link } = yield checkNewVersion(currentVersion, platform);
    const updateLink = link ? `${updateServerUrl}/${link}` : '';
    yield put(publisherCheckUpdateFinish(null, hasUpdate, version, updateLink));
  } catch (err) {
    console.log('Check update error', err);
    yield put(publisherCheckUpdateFinish(err));
  } finally {
    yield delay(checkInterval);
    yield put(publisherCheckUpdate());
  }
}
