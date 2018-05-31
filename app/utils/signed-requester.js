import moment from 'moment';
import cryptoJs from 'crypto-js';

import { AWS_ACCESS_KEY, AWS_SECRET_KEY } from './constants';

const REQUEST_METHOD = 'GET';
const REQUEST_URI = '/onca/xml';
const ENDPOINT = 'webservices.amazon.com';
const TIMESTAMP_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

const toSha256 = (stringToSign, secret) => {
  const hex = cryptoJs.HmacSHA256(stringToSign, secret);

  return hex.toString(cryptoJs.enc.Base64);
};

export const canonicalize = (queryObject = {}) => {
  const keys = Object.keys(queryObject);

  if (!keys.length) {
    return '';
  }

  return keys.reduce((canonical, key) => {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(queryObject[key]);
    const prefix = canonical ? `${canonical}&` : '';

    return `${prefix}${encodedKey}=${encodedValue}`;
  }, '');
};

export const getSignedUrl = (params) => {
  const AWSAccessKeyId = AWS_ACCESS_KEY;
  const Timestamp = `${moment.utc().format(TIMESTAMP_FORMAT)}Z`;
  const newParams = { ...params, AWSAccessKeyId, Timestamp };

  const urlParams = Object.keys(newParams)
    .sort((a, b) => (a > b) - (a < b))
    .reduce((acc, key) => ({
      ...acc,
      [key]: newParams[key],
    }), {});

  const canonicalQS = canonicalize(urlParams)
    .replace('+', '%20')
    .replace('*', '%2A')
    .replace('%7E', '~');
  console.log(canonicalQS);

  const toSign = `${REQUEST_METHOD}\n${ENDPOINT}\n${REQUEST_URI}\n${canonicalQS}`;
  const hmac = toSha256(toSign, AWS_SECRET_KEY);
  const sign = encodeURIComponent(hmac);

  return `https://${ENDPOINT}${REQUEST_URI}?${canonicalQS}&Signature=${sign}`;
};
