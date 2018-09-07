import {
  takeEvery,
  put,
  all,
  call,
  select
} from 'redux-saga/effects';
import { FetchChain } from 'omnibazaarjs/es';

import {
  getShippingRatesFinish
} from './shippingActions';

import {
  getShippingRates
} from './services';

export function* shippingSubscriber() {
  yield all([
    takeEvery('GET_SHIPPING_RATES', requestShippingRates)
  ]);
}

function* requestShippingRates({ payload: { listing, buyerAddress } }) {
  try {
    const seller = yield call(FetchChain, 'getAccount', listing.owner);
    const shipFrom = {
      name: seller.name,
      address: listing.address,
      city: listing.city,
      country: listing.country,
      state: listing.state,
      postalCode: listing.postalCode
    };
    const { username } = (yield select()).default.auth.currentUser;
    const shipTo = {
      name: username,
      ...buyerAddress
    };
    const packageData = {
      weight: {
        value: listing.weight,
        unit: listing.weightUnit
      }
    }

    const rates = yield call(getShippingRates, shipFrom, shipTo, packageData);
    yield put(getShippingRatesFinish(null, rates));
  } catch(err) {
    console.log("ERROR", err)
    yield put(getShippingRatesFinish(err));
  }
}