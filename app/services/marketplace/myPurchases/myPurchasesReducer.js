import { handleActions } from 'redux-actions';

import {
  getMyPurchases,
  getMyPurchasesFailed,
  getMyPurchasesSucceeded
} from "./myPurchesesActions";

const defaultState = {
  myPurchases: [],
  isLoading: false,
  error: null
};

const reducer = handleActions({
  [getMyPurchases](state, { payload: { from, to } }) {
    return {
      ...state,
      isLoading: true,
      error: null
    }
  },
  [getMyPurchasesSucceeded](state, { payload: { myPurchases } }) {
    return {
      myPurchases,
      isLoading: false,
    }
  },
  [getMyPurchasesFailed](state, { payload: { error } }) {
    return {
      isLoading: false,
      error
    }
  }
}, defaultState);

export default reducer;
