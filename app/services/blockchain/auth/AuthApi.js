/**
 * created by alaverdyanrafayel on 08/07/18
 */
import { wrapRequest } from '../../utils';

const apiURL = 'http://35.171.116.3:5050/api';
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

const identityVerificationApiKey = 'NRRVCPBSGZZTGD';
const identityVerificationBaseURL = 'https://api.sumsub.com';
const getIdentityVerificationToken = wrapRequest(async (userId) => fetch(`${identityVerificationBaseURL}/resources/accessTokens?userId=${userId}&key=${identityVerificationApiKey}`, {
  method: 'POST'
}));

const getApplicantInformation = wrapRequest(async (userId) => fetch(`${identityVerificationBaseURL}/resources/applicants/-;externalUserId=${userId}?key=${identityVerificationApiKey}`));

export { getIdentityVerificationToken, getApplicantInformation };
