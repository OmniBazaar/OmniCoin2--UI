import { handleActions } from 'redux-actions';
import { setReferral, sendCommand } from './preferencesActions';

const defaultState = {
  referral: false,
  sentCommands: []
};

const reducer = handleActions({
  [setReferral](state) {
    return {
      ...state,
      referral: !state.referral
    };
  },
  [sendCommand](state, { payload: { command } }) {
    return {
      ...state,
      sentCommands: [...state.sentCommands, command]
    };
  }
}, defaultState);

export default reducer;
