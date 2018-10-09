import { handleActions } from 'redux-actions';
import { ipcRenderer } from 'electron';

import {
  signup,
  login,
  logout,
  getCurrentUser,
  requestPcIds,
  requestReferrerFinish,
  getAccount,
  getLastLoginUserName,
  showTermsModal,
  getWelcomeBonusAmountSucceeded,
  welcomeBonusSucceeded,
  requestAppVersion
} from './authActions';

import {
  getStoredCurrentUser,
  storeCurrentUser,
  removeStoredCurrentUser,
  getLastStoredUserName
} from './services';

const defaultState = {
  currentUser: null,
  identityVerificationStatus: null,
  account: null,
  error: null,
  loading: false,
  isAccountLoading: false,
  lastLoginUserName: null,
  showTermsModal: false,
  welcomeBonusAmount: null,
  isWelcomeBonusAvailable: null,
  identityVerificationToken: null,
  defaultReferrer: null,
  appVersion: ''
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
      account: null,
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
  [requestAppVersion](state) {
    ipcRenderer.once('receive-app-version', (event, arg) => {
      localStorage.setItem('appVersion', arg.appVersion);
    });
    ipcRenderer.send('get-app-version', null);
    return state;
  },
  [requestReferrerFinish](state, { payload: { referrer } }) {
    return {
      ...state,
      defaultReferrer: referrer
    };
  },
  [getLastLoginUserName]: (state) => {
    const username = getLastStoredUserName();
    return {
      ...state,
      lastLoginUserName: username || null,
    };
  },
  LOGIN_FAILED: (state, action) => ({
    ...state,
    currentUser: null,
    error: action.error,
    loading: false
  }),
  WELCOME_BONUS_FAILED: (state, action) => {
    return ({
      ...state,
      loading: false,
      error: action.payload.error
    });
  },
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
  GET_IDENTITY_VERIFICATION_TOKEN_SUCCEEDED: (state, action) => ({
    ...state,
    identityVerificationToken: action.token
  }),
  GET_IDENTITY_VERIFICATION_STATUS_SUCCEEDED: (state, action) => ({
    ...state,
    identityVerificationStatus: action.response
  }),
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
      isWelcomeBonusAvailable: false,
      loading: false
    });
  },
}, defaultState);

export default reducer;
