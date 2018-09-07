import { handleActions } from 'redux-actions';
import {
  getShippingRates,
  getShippingRatesFinish
} from './shippingActions';

const defaultState = {
  shippingRates: [],
  loading: false,
  error: null
};

const reducer = handleActions({
  [getShippingRates](state) {
    return {
      ...state,
      loading: true,
      error: null,
      shippingRates: []
    };
  },
  [getShippingRatesFinish](state, { payload: { error, shippingRates } }) {
    return {
      ...state,
      loading: false,
      error,
      shippingRates: error ? [] : shippingRates
    };
  }
}, defaultState);

export default reducer;
