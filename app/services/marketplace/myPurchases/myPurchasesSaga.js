import {
  takeEvery,
  put,
  all,
  select
} from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';
import OmnicoinHistory from '../../accountSettings/omnicoinHistory';

import {
  getMyPurchasesSucceeded,
  getMyPurchasesFailed,
  getMySellingsSucceeded,
  getMySellingsFailed
} from "./myPurchasesActions";

export function* myPurchasesSubscriber() {
  yield all([
    takeEvery('GET_MY_PURCHASES', getPurchases),
    takeEvery('GET_MY_SELLINGS', getSellings)
  ])
}

function* getPurchases() {
  try {
    const { currentUser } = (yield select()).default.auth;
    const historyStorage = new OmnicoinHistory(currentUser.username);
    yield historyStorage.refresh(currentUser);
    const purchases = yield historyStorage.getBuyHistory();
    yield put(getMyPurchasesSucceeded(purchases));
  } catch (error) {
    console.log('ERROR ', error);
    yield put(getMyPurchasesFailed(error));
  }
}

function* getSellings() {
  try {
    const { currentUser } = (yield select()).default.auth;
    const historyStorage = new OmnicoinHistory(currentUser.username);
    yield historyStorage.refresh(currentUser);
    const sellings = yield historyStorage.getSellHistory();
    yield put(getMySellingsSucceeded(sellings));
  } catch (error) {
    console.log('ERROR ', error);
    yield put(getMySellingsFailed(error));
  }
}
