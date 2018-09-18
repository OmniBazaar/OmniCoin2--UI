import {
  takeEvery,
  put,
  all,
  call,
  select
} from 'redux-saga/effects';

import {
  getShippingRatesSuccess,
  getShippingRatesError
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
      postalCode: listing.post_code
    };
    const shipTo = {
      ...buyerAddress
    };
    const parcel = {
      weight: parseFloat(listing.weight) //ounces
    }
    if (listing.width) {
      parcel.width = parseFloat(listing.width);
    }
    if (listing.height) {
      parcel.height = parseFloat(listing.height);
    }
    if (listing.length) {
      parcel.length = parseFloat(listing.length);
    }
    
    const rates = yield call(getShippingRates, shipFrom, shipTo, parcel);
    yield put(getShippingRatesSuccess(rates));
  } catch(err) {
    console.log("ERROR", err)
    yield put(getShippingRatesError(err.message));
  }
}