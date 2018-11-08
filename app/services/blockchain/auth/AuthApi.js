/**
 * created by alaverdyanrafayel on 08/07/18
 */
import { wrapRequest } from '../../utils';


const apiURL = process.env.NODE_ENV === 'development'
  ? 'http://35.171.116.3:5050/api'
  : 'http://74.208.211.227:5050/api';

export const checkTwitterUsername = wrapRequest(async (data) => fetch(`${apiURL}/check-twitter-username`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}));

export const checkTelegramPhoneNumber = wrapRequest(async (data) => fetch(`${apiURL}/check-telegram-phone-number`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}));

export const checkEmail = wrapRequest(async (data) => fetch(`${apiURL}/check-email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}));

export const checkBonus = wrapRequest(async (data) => fetch(`${apiURL}/bonus-check`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}));

export const receiveWelcomeBonus = wrapRequest(async (data) => fetch(`${apiURL}/receive-welcome-bonus`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}));

export const isWelcomeBonusAvailable = wrapRequest(async (data) => fetch(`${apiURL}/is-welcome-bonus-available`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}));

export const getIdentityVerificationStatus = wrapRequest(async (username) => fetch(`${apiURL}/identity-verification-status/${username}`));
export const isWelcomeBonusReceived = wrapRequest(async (username) => fetch(`${apiURL}/is-welcome-bonus-received/${username}`));

const identityVerificationApiKey = 'NRRVCPBSGZZTGD';
const identityVerificationBaseURL = 'https://api.sumsub.com';

const getIdentityVerificationToken = wrapRequest(async (userId) => fetch(`${identityVerificationBaseURL}/resources/accessTokens?userId=${userId}&key=${identityVerificationApiKey}`, {
  method: 'POST'
}));

const getApplicantInformation = wrapRequest(async (userId) => fetch(`${identityVerificationBaseURL}/resources/applicants/-;externalUserId=${userId}?key=${identityVerificationApiKey}`));

export { getIdentityVerificationToken, getApplicantInformation };
