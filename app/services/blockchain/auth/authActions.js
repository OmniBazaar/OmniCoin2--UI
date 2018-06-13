/**
 * Created by denissamohvalov on 14.02.18.
 */
import { createActions } from 'redux-actions';

const {
  getCurrentUser,
  login,
  logout,
  signup,
  requestPcIds,
  getAccount,
  getLastLoginUserName,
  showTermsModal
} = createActions({
  GET_CURRENT_USER: () => ({}),
  LOGIN: (username, password) => ({ username, password }),
  LOGOUT: () => ({}),
  SIGNUP: (username, password, referrer, searchPriorityData, macAddress, harddriveId) => (
    {
      username, password, referrer, searchPriorityData, macAddress, harddriveId
    }
  ),
  REQUEST_PC_IDS: () => ({}),
  GET_ACCOUNT: (username) => ({ username }),
  GET_LAST_LOGIN_USER_NAME: () => ({}),
  SHOW_TERMS_MODAL: () => ({}),
});

export {
  getCurrentUser,
  login,
  logout,
  signup,
  requestPcIds,
  getAccount,
  getLastLoginUserName,
  showTermsModal
};
