import { handleActions } from 'redux-actions';
import { getCurrencyRates, getCurrencyRatesFinished } from './currencyActions';

const defaultState = {
  currencyRates: null,
  loading: false,
  error: null
};

const reducer = handleActions({
  [getCurrencyRates](state) {
    return {
      ...state,
      loading: true,
      error: null
    };
  },
  [getCurrencyRatesFinished](state, { payload: { error, rates } }) {
    if (error) {
      return {
        ...state,
        loading: false,
        error
      };
    }

    return {
      ...state,
      loading: false,
      currencyRates: rates
    };
  }
}, defaultState);

export default reducer;
