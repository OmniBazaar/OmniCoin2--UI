
import { handleActions, combineActions } from 'redux-actions';
import { ipcRenderer } from 'electron';

import {
  signup,
  login,
  logout,
  getCurrentUser,
  accountLookup,
  requestPcIds
} from './authActions';

const defaultState = {
  currentUser: null,
  error: null,
  accountExists: false,
  loading: false,
};

const reducer = handleActions({
  [getCurrentUser](state, { payload: {} }) {
    return {
      ...state,
      currentUser: localStorage.getItem('currentUser')
    };
  },
  [login](state, { payload: { username, password } }) {
    return {
      ...state,
      error: null,
      loading: true
    };
  },
  [logout](state, { payload: {} }) {
    localStorage.removeItem('currentUser');
    return {
      ...state,
      currentUser: null
    };
  },
  [signup](state, {
    payload: {
      username, password, referrer, macAddress, harddriveId
    }
  }) {
    return {
      ...state,
      error: null,
      loading: true,
    };
  },
  [accountLookup](state, { payload: { username } }) {
    return {
      ...state
    };
  },
  [requestPcIds](state, { payload: {} }) {
    ipcRenderer.once('receive-pc-ids', (event, arg) => {
      localStorage.setItem('hardDriveId', arg.hardDriveId);
      localStorage.setItem('macAddress', arg.macAddress);
    });
    ipcRenderer.send('get-pc-ids', null);
  },
  LOGIN_FAILED: (state, action) => ({
    ...state,
    currentUser: null,
    error: action.error,
    loading: false
  }),
  LOGIN_SUCCEEDED: (state, action) => {
    localStorage.setItem('currentUser', action.user);
    return {
      ...state,
      currentUser: action.user,
      error: null,
      loading: false
    };
  },
  SIGNUP_SUCCEEDED: (state, action) => {
    localStorage.setItem('currentUser', action.user);
    return {
      ...state,
      currentUser: action.user,
      error: null,
      loading: false
    };
  },
  SIGNUP_FAILED: (state, action) => ({
    ...state,
    currentUser: null,
    error: action.error,
    loading: false
  }),
  ACCOUNT_LOOKUP: (state, action) => ({
    ...state,
    accountExists: false,
    loading: true
  }),
  ACCOUNT_LOOKUP_SUCCEEDED: (state, action) => ({
    ...state,
    accountExists: action.result,
    loading: false
  }),
}, defaultState);

export default reducer;
