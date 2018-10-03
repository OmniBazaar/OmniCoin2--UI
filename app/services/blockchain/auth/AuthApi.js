/**
 * created by alaverdyanrafayel on 08/07/18
 */
import { wrapRequest } from '../../utils';

const apiURL = 'http://199.250.203.82:5000/api';

// const apiURL = 'http://localhost:5000/api';

const KYCApiURL = 'http://35.171.116.3:5050/api';


export const checkBonus = wrapRequest(async (data) => fetch(`${apiURL}/bonus-check`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}));

export const welcomeBonusReceivedUsers = wrapRequest(async (data) => fetch(`${apiURL}/welcome-bonus-received-users`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}));


export const getIdentityVerificationStatus = wrapRequest(async (username) => fetch(`${KYCApiURL}/identity-verification-status/${username}`));

const identityVerificationApiKey = 'JGNAJSHUJFGEQR';
const identityVerificationBaseURL = 'https://test-api.sumsub.com';
const getIdentityVerificationToken = wrapRequest(async (userId) => fetch(`${identityVerificationBaseURL}/resources/accessTokens?userId=${userId}&key=${identityVerificationApiKey}`, {
  method: 'POST'
}));

const getApplicantInformation = wrapRequest(async (userId) => fetch(`${identityVerificationBaseURL}/resources/applicants/-;externalUserId=${userId}?key=${identityVerificationApiKey}`));

export { getIdentityVerificationToken, getApplicantInformation };
