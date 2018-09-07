import { createActions } from 'redux-actions';

const {
  getShippingRates,
  getShippingRatesFinish
} = createActions({
  GET_SHIPPING_RATES: (listing, buyerAddress) => ({ listing, buyerAddress }),
  GET_SHIPPING_RATES_FINISH: (error, shippingRates) => ({ error, shippingRates })
});

export {
  getShippingRates,
  getShippingRatesFinish
};