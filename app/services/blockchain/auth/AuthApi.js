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

export const checkTelegramUser = wrapRequest(async (user, data) => doAuthRequest(`${apiURL}/check-telegram-user`, user, {
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

// const identityVerificationApiKey = 'JGNAJSHUJFGEQR';
const identityVerificationBaseURL = 'https://api.sumsub.com';
const username = 'omnibazaar_api';
const password = 'Cq0x07J5bT';
const getIdentityVerificationToken = async (userId) => {
  const base64Auth = Buffer.from(`${username}:${password}`).toString('base64');
  const loginResp = await fetch(`${identityVerificationBaseURL}/resources/auth/login`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64Auth}`
    }
  });

  const loginToken = (await loginResp.json()).payload;
  const accessTokenResp = await fetch(`${identityVerificationBaseURL}/resources/accessTokens?userId=${userId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${loginToken}`
    }
  });
  const accessToken = (await accessTokenResp.json()).token;
  await makeApplicantRequest(userId, accessToken);

  return accessToken;
};

const makeApplicantRequest = async (userId, token) => fetch(`${identityVerificationBaseURL}/resources/accounts/-/applicantRequests`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    applicant: {
      requiredIdDocs: {
        docSets: [
          {
            "idDocSetType": "APPLICANT_DATA",
            "types": null,
            "subTypes": null,
            "fields": [
              {
                "name": "firstName",
                "required": true
              },
              {
                "name": "lastName",
                "required": true
              }
            ],
            "imageIds": null,
            "mode": null
          },
          {
            idDocSetType: "IDENTITY",
            types: ["ID_CARD", "PASSPORT", "DRIVERS"]
          }, {
            idDocSetType: "SELFIE",
            types: ["SELFIE"]
          }
        ]
      },
      externalUserId: userId
    }
  })
});

// const getApplicantInformation = wrapRequest(async (userId) => fetch(`${identityVerificationBaseURL}/resources/applicants/-;externalUserId=${userId}?key=${identityVerificationApiKey}`));

export { getIdentityVerificationToken };
