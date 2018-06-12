import {
  takeEvery,
  put,
  all,
  call,
  select
} from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';
import { FetchChain } from 'omnibazaarjs/es';

import {
  getMyPurchases,
  getMyPurchasesSucceeded,
  getMyPurchasesFailed
} from "./myPurchesesActions";

export function* myPurchasesSubscriber() {
  yield all([
    takeEvery('GET_MY_PURCHASES', getPurchases)
  ])
}

function* getPurchases() {
  try {
    console.log("GETTING PURCHASES ");
    const { currentUser } = (yield select()).default.auth;
    const userAcc = yield FetchChain('getAccount', currentUser.username);
    const purchases = Apis.instance().history_api().exec("get_purchase_history", [userAcc.get('id')]);
    console.log('PURCHASES ', JSON.stringify(purchases, null, 2));
    yield put(getMyPurchasesSucceeded(purchases));
  } catch (error) {
    console.log('ERROR ', error);
    yield put(getMyPurchasesFailed(error));
  }
}
