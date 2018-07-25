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
  getWelcomeBonusAmount,
  getWelcomeBonusAmountSucceeded,
  getWelcomeBonusAmountFailed,
  receiveWelcomeBonus,
  getIdentityVerificationToken,
  getIdentityVerificationTokenSucceeded,
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
  GET_WELCOME_BONUS_AMOUNT: () => {},
  GET_WELCOME_BONUS_AMOUNT_SUCCEEDED: (amount) => ({ amount }),
  GET_WELCOME_BONUS_AMOUNT_FAILED: () => {},
  RECEIVE_WELCOME_BONUS: (data) => ({ data }),
  GET_IDENTITY_VERIFICATION_TOKEN: (username) => ({ username }),
  GET_IDENTITY_VERIFICATION_TOKEN_SUCCEEDED: (token) => ({ token }),
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
  getWelcomeBonusAmount,
  getWelcomeBonusAmountSucceeded,
  getWelcomeBonusAmountFailed,
  receiveWelcomeBonus,
  getIdentityVerificationToken,
  getIdentityVerificationTokenSucceeded,
  requestPcIds,
  requestReferrer,
  getAccount,
  getLastLoginUserName,
  showTermsModal
};
