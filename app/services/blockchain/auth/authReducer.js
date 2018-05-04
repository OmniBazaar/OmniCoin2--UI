
import { handleActions } from 'redux-actions';
import { ipcRenderer } from 'electron';

import {
  signup,
  login,
  logout,
  getCurrentUser,
  requestPcIds,
  getAccount,
  getLastLoginUserName
} from './authActions';

const defaultState = {
  currentUser: null,
  account: null,
  error: null,
  loading: false,
  isAccountLoading: false,
  lastLoginUserName: null
};

const reducer = handleActions({
  [getCurrentUser](state) {
    return {
      ...state,
      currentUser: JSON.parse(localStorage.getItem('currentUser'))
    };
  },
  [login](state, { payload: { username, password } }) {
    return {
      ...state,
      error: null,
      loading: true
    };
  },
  [logout](state) {
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
  [getAccount](state, { payload: { username } }) {
    return {
      ...state,
      isAccountLoading: true
    };
  },
  [requestPcIds](state) {
    ipcRenderer.once('receive-pc-ids', (event, arg) => {
      localStorage.setItem('hardDriveId', arg.hardDriveId);
      localStorage.setItem('macAddress', arg.macAddress);
    });
    ipcRenderer.send('get-pc-ids', null);
  },
  [getLastLoginUserName]: (state) => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return {
      ...state,
      lastLoginUserName: user ? user.username : null
    };
  },
  LOGIN_FAILED: (state, action) => ({
    ...state,
    currentUser: null,
    error: action.error,
    loading: false
  }),
  LOGIN_SUCCEEDED: (state, action) => {
    localStorage.setItem('currentUser', JSON.stringify(action.user));
    return {
      ...state,
      currentUser: action.user,
      error: null,
      loading: false
    };
  },
  SIGNUP_SUCCEEDED: (state, action) => {
    localStorage.setItem('currentUser', JSON.stringify(action.user));
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
  GET_ACCOUNT_SUCCEEDED: (state, { account }) => ({
    ...state,
    account,
    error: null,
    isAccountLoading: false
  }),
  GET_ACCOUNT_FAILED: (state, { error }) => ({
    ...state,
    account: null,
    error,
    isAccountLoading: false
  })
}, defaultState);

export default reducer;
