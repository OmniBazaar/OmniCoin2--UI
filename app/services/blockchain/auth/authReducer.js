import { handleActions } from 'redux-actions';
import { ipcRenderer } from 'electron';

import {
  signup,
  login,
  logout,
  getCurrentUser,
  requestPcIds,
  requestReferrer,
  getAccount,
  getLastLoginUserName,
  showTermsModal,
  getWelcomeBonusAmountSucceeded,
  welcomeBonusSucceeded,
} from './authActions';

import {
  getStoredCurrentUser,
  storeCurrentUser,
  removeStoredCurrentUser,
  getLastStoredUserName
} from './services';

const defaultState = {
  currentUser: null,
  account: null,
  error: null,
  loading: false,
  isAccountLoading: false,
  lastLoginUserName: null,
  showTermsModal: false,
  welcomeBonusAmount: null,
  isWelcomeBonusAvailable: null
};

const reducer = handleActions({
  [getCurrentUser](state) {
    return {
      ...state,
      currentUser: getStoredCurrentUser()
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
    removeStoredCurrentUser();
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
    return state;
  },
  [requestReferrer](state) {
    ipcRenderer.once('receive-referrer', (event, arg) => {
      localStorage.setItem('referrer', arg.referrer);
    });
    ipcRenderer.send('get-referrer', null);
    return state;
  },
  [getLastLoginUserName]: (state) => {
    const username = getLastStoredUserName();
    return {
      ...state,
      lastLoginUserName: username ? username : null
    };
  },
  LOGIN_FAILED: (state, action) => ({
    ...state,
    currentUser: null,
    error: action.error,
    loading: false
  }),
  LOGIN_SUCCEEDED: (state, action) => {
    storeCurrentUser(action.user);
    return {
      ...state,
      currentUser: action.user,
      error: null,
      loading: false,
      lastLoginUserName: action.user.username
    };
  },
  SIGNUP_SUCCEEDED: (state, action) => {
    storeCurrentUser(action.user);
    return {
      ...state,
      currentUser: action.user,
      isWelcomeBonusAvailable: action.isWelcomeBonusAvailable,
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
  }),
  RECEIVE_WELCOME_BONUS: (state) => ({
    ...state,
    error: null,
    loading: true
  }),
  [showTermsModal](state) {
    return {
      ...state,
      showTermsModal: !state.showTermsModal
    };
  },
  [getWelcomeBonusAmountSucceeded](state, { amount }) {
    return ({
      ...state,
      welcomeBonusAmount: amount
    });
  },
  [welcomeBonusSucceeded](state) {
    return ({
      ...state,
      isWelcomeBonusAvailable: false
    });
  },
}, defaultState);

export default reducer;
