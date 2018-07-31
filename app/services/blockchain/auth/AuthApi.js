/**
 * created by alaverdyanrafayel on 08/07/18
 */
import cryptoJs from 'crypto-js';
import { wrapRequest } from '../../utils';

const apiURL = 'http://localhost:5000/api';


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

export {getIdentityVerificationToken};
