import { createActions } from 'redux-actions';

const {
  connect,
  getDynGlobalObject,
  restartNode,
  restartNodeSucceeded,
  restartNodeFailed
} = createActions({
  CONNECT: (nodes) => ({ nodes }),
  GET_DYN_GLOBAL_OBJECT: () => ({}),
  RESTART_NODE: () => ({}),
  RESTART_NODE_SUCCEEDED: () => ({}),
  RESTART_NODE_FAILED: (error) => ({ error })
});

export {
  connect,
  getDynGlobalObject,
  restartNode,
  restartNodeSucceeded,
  restartNodeFailed
};
