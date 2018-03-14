import { handleActions } from 'redux-actions';
import { connect, } from './connectionActions';

const defaultState = {
  node: null,
  latency: null,
  dynGlobalObject: null,
  isLoading: false,
  error: null,
};

const reducer = handleActions({
  [connect](state, { payload: { node } }) {
    return {
      ...state,
      isLoading: true,
      node
    };
  },
  CONNECT_SUCCEEDED: (state, { node, latency }) => ({
    ...state,
    isLoading: false,
    error: null,
    node,
    latency,
  }),
  CONNECT_FAILED: (state, { error }) => ({
    ...state,
    node: null,
    latency: null,
    isLoading: false,
    error
  }),
  DYN_GLOBAL_OBJECT_SUCCEEDED: (state, { dynGlobalObject }) => ({
    ...state,
    dynGlobalObject,
    error: false
  }),
  DYN_GLOBAL_OBJECT_FAILED: (state, { error }) => ({
    ...state,
    error
  }),
}, defaultState);

export default reducer;
