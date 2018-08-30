import { handleActions } from 'redux-actions';
import {
  publisherCheckUpdate,
  publisherCheckUpdateFinish
} from './publisherUpdateNotificationActions';

const defaultState = {
  hasUpdate: false,
  updateLink: '',
  checking: false,
  error: null,
  version: ''
};

const reducer = handleActions({
  [publisherCheckUpdate](state) {
    return {
      ...state,
      checking: true,
      error: null
    };
  },
  [publisherCheckUpdateFinish](state, {
    payload: {
      hasUpdate, version, error, updateLink
    }
  }) {
    if (error) {
      return {
        ...state,
        checking: false,
        error
      };
    }
    return {
      ...state,
      hasUpdate,
      updateLink,
      version,
      checking: false
    };
  }
}, defaultState);

export default reducer;
