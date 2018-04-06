import { handleActions } from 'redux-actions';
import {
  getListingDetail,
  setActiveCurrency
} from './listingActions';

const CoinTypes = Object.freeze({
  OMNI_COIN: 'OmniCoin',
});

const defaultState = {
  listingDetail: {},
  activeCurrency: CoinTypes.OMNI_COIN,
};

const reducer = handleActions({
  [getListingDetail](state, { payload: { listingDetail } }) {
    return {
      ...state,
      listingDetail
    };
  },
  [setActiveCurrency](state, { payload: { activeCurrency } }) {
    return {
      ...state,
      activeCurrency
    };
  },
}, defaultState);

export default reducer;
