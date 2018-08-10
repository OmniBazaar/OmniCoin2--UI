/**
 * created by alaverdyanrafayel on 08/07/18
 */
import { wrapRequest } from '../../utils';

const apiURL = 'http://199.250.203.82:5000/api';


export const checkBonus = wrapRequest(async (data) => fetch(`${apiURL}/bonus-check`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
}));


const identityVerificationApiKey = 'JGNAJSHUJFGEQR';
const identityVerificationBaseURL = 'https://test-api.sumsub.com';
const getIdentityVerificationToken = wrapRequest(async (userId) => fetch(`${identityVerificationBaseURL}/resources/accessTokens?userId=${userId}&key=${identityVerificationApiKey}`, {
  method: 'POST'
}));

const getApplicantInformation = wrapRequest(async (userId) => fetch(`${identityVerificationBaseURL}/resources/applicants/-;externalUserId=${userId}?key=${identityVerificationApiKey}`));

const getIdentityVerificationStatus = wrapRequest(async (applicantId) => fetch(`${identityVerificationBaseURL}/resources/applicants/${applicantId}/status?key=${identityVerificationApiKey}`));

export { getIdentityVerificationToken, getApplicantInformation, getIdentityVerificationStatus };
