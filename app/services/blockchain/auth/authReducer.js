
import { handleActions, combineActions } from 'redux-actions';
import {ipcRenderer} from 'electron';

import {
  signup,
  login,
  getCurrentUser,
  accountLookup,
  requestPcIds
} from './authActions';

let defaultState = {
    currentUser: null,
    error: null,
    accountExists: false,
    loading: false,
};

const reducer = handleActions({
    [getCurrentUser](state, {payload: {}}) {
        return {
            ...state,
            currentUser: localStorage.getItem('currentUser')
        }
    },
    [login](state, {payload: {username, password}}) {
      return {
          ...state,
          error: null,
          loading: true
      }
    },
    [signup](state, {payload: {username, password, referrer, mac_address, harddrive_id}}) {
        return {
            ...state,
            error: null,
            loading: true,
        }
    },
    [accountLookup](state, {payload: {username}}) {
      return {
        ...state
      }
    },
    [requestPcIds](state, {payload: {}}) {
      ipcRenderer.once('receive-pc-ids', (event, arg) => {
          localStorage.setItem("hardDriveId", arg.hardDriveId);
          localStorage.setItem("macAddress", arg.macAddress);
      });
      ipcRenderer.send('get-pc-ids', null);
    },
    LOGIN_FAILED: (state, action) => {
        return {
            ...state,
            currentUser: null,
            error: action.error,
            loading: false
        }
    },
    LOGIN_SUCCEEDED: (state, action) => {
        localStorage.setItem('currentUser', action.user);
        return {
            ...state,
            currentUser: action.user,
            error: null,
            loading: false
        }
    },
    SIGNUP_SUCCEEDED: (state, action) => {
      localStorage.setItem('currentUser', action.user);
      return  {
          ...state,
          currentUser: action.user,
          error: null,
          loading: false
        }
    },
    SIGNUP_FAILED: (state, action) => {
        return  {
          ...state,
          currentUser: null,
          error: action.error,
          loading: false
        }
    },
    ACCOUNT_LOOKUP: (state, action) => {
      return {
        ...state,
        accountExists: false,
        loading: true
      }
    },
    ACCOUNT_LOOKUP_SUCCEEDED: (state, action) => {
      return {
        ...state,
        accountExists: action.result,
        loading: false
      }
    },
}, defaultState);

export default reducer;
