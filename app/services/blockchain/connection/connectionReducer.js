import { handleActions } from 'redux-actions';

import {
  connect,
  restartNode,
  restartNodeSucceeded,
  restartNodeFailed
} from './connectionActions';

const defaultState = {
  node: null,
  latency: null,
  dynGlobalObject: null,
  isLoading: false,
  error: null,
  restartingNode: false
};

const reducer = handleActions({
  [connect](state, { payload: { node } }) {
    return {
      ...state,
      isLoading: true,
      node
    };
  },
  [restartNode](state) {
    return {
      ...state,
      restartingNode: true
    };
  },
  [restartNodeSucceeded](state) {
    return {
      ...state,
      restartingNode: false,
    };
  },
  [restartNodeFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      restartingNode: false
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
