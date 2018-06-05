import { handleActions } from 'redux-actions';
import { setReferral, sendCommand } from './preferencesActions';

const defaultState = {
  
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
