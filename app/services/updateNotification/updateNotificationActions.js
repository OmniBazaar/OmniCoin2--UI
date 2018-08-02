import { createActions } from 'redux-actions';

const {
  checkUpdate,
  checkUpdateFinish
} = createActions({
  CHECK_UPDATE: () => ({}),
  CHECK_UPDATE_FINISH: (error, hasUpdate, version, updateLink) => ({
    error, hasUpdate, version, updateLink
  })
});

export {
  checkUpdate,
  checkUpdateFinish
};
