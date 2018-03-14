import { handleActions } from 'redux-actions';
import { setActiveNode, } from './settingsActions';
import { nodes } from '../blockchain/connection/connectionSaga';

const defaultState = {
  activeNode: nodes[2]
};

const reducer = handleActions({
  [setActiveNode](state, { payload: { node } }) {
    return {
      ...state,
      activeNode: node
    };
  }
}, defaultState);

export default reducer;
