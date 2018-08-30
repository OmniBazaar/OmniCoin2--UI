import { createActions } from 'redux-actions';

const {
  publisherCheckUpdate,
  publisherCheckUpdateFinish
} = createActions({
  PUBLISHER_CHECK_UPDATE: () => ({}),
  PUBLISHER_CHECK_UPDATE_FINISH: (error, hasUpdate, version, updateLink) => ({
    error, hasUpdate, version, updateLink
  })
});

export {
  publisherCheckUpdate,
  publisherCheckUpdateFinish
};
