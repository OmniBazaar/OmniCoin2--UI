import { handleActions } from 'redux-actions';
import {
  getShippingRates,
  getShippingRatesSuccess,
  getShippingRatesError,
  selectShippingRate
} from './shippingActions';

const defaultState = {
  shippingRates: [],
  loading: false,
  error: null,
  selectedShippingRateIndex: -1
};

const reducer = handleActions({
  [getShippingRates](state) {
    return {
      ...state,
      loading: true,
      error: null,
      shippingRates: [],
      selectedShippingRateIndex: -1
    };
  },
  [getShippingRatesSuccess](state, { payload: { shippingRates } }) {
    return {
      ...state,
      loading: false,
      error: false,
      shippingRates,
      selectedShippingRateIndex: 0
    };
  },
  [getShippingRatesError](state, { payload: { error } }) {
    return {
      ...state,
      loading: false,
      error,
      shippingRates: []
    };
  },
  [selectShippingRate](state, { payload: { index } }) {
    return {
      ...state,
      selectedShippingRateIndex: index
    };
  }
}, defaultState);

export default reducer;
