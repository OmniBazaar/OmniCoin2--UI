/**
 * created by alaverdyanrafayel on 08/07/18
 */
import { wrapRequest } from '../../utils';
import { apiURL } from '../../../config/config';
import { getAuthHeaders } from '../../listing/apis';

const doAuthRequest = async (url, user, options) => {
  if (!options) options = {};
  const authHeader = await getAuthHeaders(user);
  return fetch(url, {
    ...options,
    headers: {
      ...authHeader,
      ...options.headers
    }
  });
}

export const checkTwitterUsername = wrapRequest(async (user, data) => doAuthRequest(`${apiURL}/check-twitter-username`, user, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}));

export const checkTelegramPhoneNumber = wrapRequest(async (user, data) => doAuthRequest(`${apiURL}/check-telegram-phone-number`, user, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}));

export const checkEmail = wrapRequest(async (user, data) => doAuthRequest(`${apiURL}/check-email`, user, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}));

export const checkBonus = wrapRequest(async (user, data) => doAuthRequest(`${apiURL}/bonus-check`, user, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}));

export const receiveWelcomeBonus = wrapRequest(async (user, data) => doAuthRequest(`${apiURL}/receive-welcome-bonus`, user, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}));

export const isWelcomeBonusAvailable = wrapRequest(async (user, data) => doAuthRequest(`${apiURL}/is-welcome-bonus-available`, user, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}));

export const getIdentityVerificationStatus = wrapRequest(async (user, username) => doAuthRequest(`${apiURL}/identity-verification-status/${username}`, user));

export const isWelcomeBonusReceived = wrapRequest(async (user, username) => doAuthRequest(`${apiURL}/is-welcome-bonus-received/${username}`, user));

const identityVerificationApiKey = 'JGNAJSHUJFGEQR';
const identityVerificationBaseURL = 'https://test-api.sumsub.com';
const getIdentityVerificationToken = wrapRequest(async (userId) => fetch(`${identityVerificationBaseURL}/resources/accessTokens?userId=${userId}&key=${identityVerificationApiKey}`, {
  method: 'POST'
}));

const getApplicantInformation = wrapRequest(async (userId) => fetch(`${identityVerificationBaseURL}/resources/applicants/-;externalUserId=${userId}?key=${identityVerificationApiKey}`));

export { getIdentityVerificationToken, getApplicantInformation };
