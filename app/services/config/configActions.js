import { createActions } from 'redux-actions';

const {
  getConfig,
  getConfigSucceeded,
  getConfigFailed
} = createActions({
  GET_CONFIG: () => ({ }),
  GET_CONFIG_SUCCEEDED: (config) => ({ config }),
  GET_CONFIG_FAILED: (error) => ({ error })
});

export {
  getConfig,
  getConfigSucceeded,
  getConfigFailed
};
