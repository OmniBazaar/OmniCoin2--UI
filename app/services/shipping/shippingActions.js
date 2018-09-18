import { createActions } from 'redux-actions';

const {
  getShippingRates,
  getShippingRatesSuccess,
  getShippingRatesError,
  selectShippingRate
} = createActions({
  GET_SHIPPING_RATES: (listing, buyerAddress) => ({ listing, buyerAddress }),
  GET_SHIPPING_RATES_SUCCESS: (shippingRates) => ({ shippingRates }),
  GET_SHIPPING_RATES_ERROR: (error) => ({ error }),
  SELECT_SHIPPING_RATE: (index) => ({ index })
});

export {
  getShippingRates,
  getShippingRatesSuccess,
  getShippingRatesError,
  selectShippingRate
};