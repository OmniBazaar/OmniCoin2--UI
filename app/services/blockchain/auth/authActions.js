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
  referralBonus,
  referralBonusSucceeded,
  referralBonusFailed,
  getWelcomeBonusAmount,
  getWelcomeBonusAmountSucceeded,
  getWelcomeBonusAmountFailed,
  receiveWelcomeBonus,
  getIdentityVerificationToken,
  getIdentityVerificationTokenSucceeded,
  getIdentityVerificationStatus,
  getIdentityVerificationStatusSucceeded,
  requestPcIds,
  requestAppVersion,
  requestReferrer,
  requestReferrerFinish,
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
  WELCOME_BONUS: (username, referrer, macAddress, harddriveId) => ({
    username, referrer, macAddress, harddriveId
  }),
  REFERRAL_BONUS: () => ({ }),
  REFERRAL_BONUS_SUCCEEDED: () => ({ }),
  REFERRAL_BONUS_FAILED: (error) => ({ error }),
  WELCOME_BONUS_SUCCEEDED: () => ({ }),
  WELCOME_BONUS_FAILED: (error) => ({ error }),
  GET_WELCOME_BONUS_AMOUNT: () => {},
  GET_WELCOME_BONUS_AMOUNT_SUCCEEDED: (amount) => ({ amount }),
  GET_WELCOME_BONUS_AMOUNT_FAILED: () => {},
  RECEIVE_WELCOME_BONUS: (data) => ({ data }),
  GET_IDENTITY_VERIFICATION_TOKEN: (username) => ({ username }),
  GET_IDENTITY_VERIFICATION_TOKEN_SUCCEEDED: (token) => ({ token }),
  GET_IDENTITY_VERIFICATION_STATUS_SUCCEEDED: (reviewAnswer) => ({ reviewAnswer }),
  GET_IDENTITY_VERIFICATION_STATUS: (data) => ({ data }),
  REQUEST_PC_IDS: () => ({}),
  REQUEST_APP_VERSION: () => ({}),
  REQUEST_REFERRER: () => ({}),
  REQUEST_REFERRER_FINISH: (referrer) => ({ referrer }),
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
  referralBonus,
  referralBonusSucceeded,
  referralBonusFailed,
  getWelcomeBonusAmount,
  getWelcomeBonusAmountSucceeded,
  getWelcomeBonusAmountFailed,
  receiveWelcomeBonus,
  getIdentityVerificationToken,
  getIdentityVerificationTokenSucceeded,
  getIdentityVerificationStatus,
  getIdentityVerificationStatusSucceeded,
  requestPcIds,
  requestReferrer,
  requestReferrerFinish,
  getAccount,
  getLastLoginUserName,
  showTermsModal,
  requestAppVersion
};
