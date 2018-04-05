import { handleActions } from 'redux-actions';
import { getListingDetail } from './listingActions';

const defaultState = {
  listingDetail: {},
};

const reducer = handleActions({
  [getListingDetail](state, { payload: { listingDetail } }) {
    return {
      ...state,
      listingDetail
    };
  },
}, defaultState);

export default reducer;
