import { createActions } from 'redux-actions';

const {
  getCurrencyRates,
  getCurrencyRatesFinished
} = createActions({
  GET_CURRENCY_RATES: () => ({}),
  GET_CURRENCY_RATES_FINISHED: (error, rates) => ({ error, rates })
});

export {
  getCurrencyRates,
  getCurrencyRatesFinished
}
