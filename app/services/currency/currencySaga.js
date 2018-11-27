import {
  put,
  takeEvery,
  select,
  all,
  call
} from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { getCurrencyRatesFinished } from './currencyActions';
import { requestCurrencyRates } from './services';

const getRatesInterval = 60000;
let timeoutHandler = null;

export function* currencySubscriber() {
  yield all([
    takeEvery('GET_CURRENCY_RATES', getCurrencyRates)
  ]);
}

let currencyRates = {};

export function* getCurrencyRates() {
  try {
    const rates = yield call(requestCurrencyRates);
    currencyRates = {
      'USDtoEUR': rates.USDtoEUR,
      'USDtoBITCOIN': rates.USDtoBTC,
      'USDtoETHEREUM': rates.USDtoETH,
      'USDtoOMNICOIN': 300.03
    };
    yield put(getCurrencyRatesFinished(null, currencyRates));
  } catch (error) {
    console.log('ERROR ', error);
    yield put(getCurrencyRatesFinished(error.message));
  } finally {
    yield delay(getRatesInterval);
    yield put({type: 'GET_CURRENCY_RATES'})
  }
}

export const getRates = () => {
  return currencyRates;
}