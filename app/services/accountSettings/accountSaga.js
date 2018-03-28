import {
  put,
  takeLatest,
  call,
  select,
  all,
  takeEvery
} from 'redux-saga/effects';
import { TransactionBuilder, ChainStore } from 'omnibazaarjs/es';


export function* accountSubscriber() {
  yield all([
    takeLatest('UPDATE_PUBLIC_DATA', updatePublicData),
  ]);
}

export function* updatePublicData() {
 // const state = (yield select()).default.account;
 console.log("State", yield select());
}


export function* updateAccount(payload) {
  const state = (yield select()).default;
}

