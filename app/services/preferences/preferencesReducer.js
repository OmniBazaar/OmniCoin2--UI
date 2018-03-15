import { handleActions } from 'redux-actions';
import { setReferral } from './preferencesActions';

const defaultState = {
  referral: false
};

const reducer = handleActions({
  [setReferral](state) {
    return {
      ...state,
      referral: !state.referral
    };
  }
}, defaultState);

export default reducer;
