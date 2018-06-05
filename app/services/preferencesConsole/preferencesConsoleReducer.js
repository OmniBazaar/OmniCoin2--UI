import { handleActions } from 'redux-actions';
import {
  sendCommand
} from './preferencesConsoleActions';

const defaultState = {
  commands: []
};

const reducer = handleActions({
  [sendCommand](state, { payload: { command } }) {
    return {
      ...state,
      commands: [
        ...state.commands,
        command
      ]
    };
  }
}, defaultState);

export default reducer;
