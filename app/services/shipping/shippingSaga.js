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

const cmToIn = 0.393701;
const kgToOz = 35.274;

export function* shippingSubscriber() {
  yield all([
    takeEvery('GET_SHIPPING_RATES', requestShippingRates)
  ]);
}

function* requestShippingRates({ payload: { listing, buyerAddress, quantity } }) {
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
    let weight = listing.weight;
    if (!weight) {
      weight = 0;
    }
    weight = parseFloat(listing.weight);
    if (listing.weight_unit === 'kg') {
      weight *= kgToOz;
    }
    const parcel = {
      weight: parseFloat(weight.toFixed(1)) //ounces
    }
    if (listing.width) {
      let width = parseFloat(listing.width);
      if (listing.width_unit === 'cm') {
        width *= cmToIn;
      }
      parcel.width = parseFloat(width.toFixed(1));
    }
    if (listing.height) {
      let height = parseFloat(listing.height);
      if (listing.height_unit === 'cm') {
        height *= cmToIn;
      }
      parcel.height = parseFloat(height.toFixed(1));
    }
    if (listing.length) {
      let length = parseFloat(listing.length);
      if (listing.length_unit === 'cm') {
        length *= cmToIn;
      }
      parcel.length = parseFloat(length.toFixed(1));
    }
    
    const rates = yield call(getShippingRates, shipFrom, shipTo, parcel, quantity);
    yield put(getShippingRatesSuccess(rates));
  } catch(err) {
    console.log("ERROR", err)
    yield put(getShippingRatesError(err.message));
  }
}