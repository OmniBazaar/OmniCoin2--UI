/**
 * Created by denissamohvalov on 14.02.18.
 */
import { createActions } from 'redux-actions';

const {
  getCurrentUser,
  login,
  logout,
  signup,
  welcomeBonus,
  welcomeBonusSucceeded,
  welcomeBonusFailed,
  requestPcIds,
  requestReferrer,
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
  WELCOME_BONUS: (username, referrer, macAddress, harddriveId) => ({ username, referrer, macAddress, harddriveId }),
  WELCOME_BONUS_SUCCEEDED: () => ({ }),
  WELCOME_BONUS_FAILED: (error) => ({ error }),
  REQUEST_PC_IDS: () => ({}),
  REQUEST_REFERRER: () => ({}),
  GET_ACCOUNT: (username) => ({ username }),
  GET_LAST_LOGIN_USER_NAME: () => ({}),
  SHOW_TERMS_MODAL: () => ({}),
});

export {
  getCurrentUser,
  login,
  logout,
  signup,
  welcomeBonus,
  welcomeBonusSucceeded,
  welcomeBonusFailed,
  requestPcIds,
  requestReferrer,
  getAccount,
  getLastLoginUserName,
  showTermsModal
};
