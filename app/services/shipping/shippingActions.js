import { createActions } from 'redux-actions';

const {
  getShippingRates,
  getShippingRatesSuccess,
  getShippingRatesError,
  selectShippingRate,
  resetShipping
} = createActions({
  GET_SHIPPING_RATES: (listing, buyerAddress, quantity) => ({ listing, buyerAddress, quantity }),
  GET_SHIPPING_RATES_SUCCESS: (shippingRates) => ({ shippingRates }),
  GET_SHIPPING_RATES_ERROR: (error) => ({ error }),
  SELECT_SHIPPING_RATE: (index) => ({ index }),
  RESET_SHIPPING: () => ({})
});

export {
  getShippingRates,
  getShippingRatesSuccess,
  getShippingRatesError,
  selectShippingRate,
  resetShipping
};