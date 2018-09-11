import {
  takeEvery,
  put,
  all,
  call,
  select
} from 'redux-saga/effects';

import {
  getShippingRatesFinish
} from './shippingActions';

import {
  getShippingRates
} from './easypost_services';

export function* shippingSubscriber() {
  yield all([
    takeEvery('GET_SHIPPING_RATES', requestShippingRates)
  ]);
}

function* requestShippingRates({ payload: { listing, buyerAddress } }) {
  try {
    const shipFrom = {
      address: listing.address,
      city: listing.city,
      country: listing.country,
      state: listing.state,
      postalCode: listing.postalCode
    };
    const shipTo = {
      ...buyerAddress
    };
    const parcel = {
      weight: listing.weight //ounces
    }
    
    const rates = yield call(getShippingRates, shipFrom, shipTo, parcel);
    yield put(getShippingRatesFinish(null, rates));
  } catch(err) {
    console.log("ERROR", err)
    yield put(getShippingRatesFinish(err));
  }
}