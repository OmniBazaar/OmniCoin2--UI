import moment from 'moment';
import createHmac from 'create-hmac';

import { AWS_ACCESS_KEY, AWS_SECRET_KEY } from './constants';

const REQUEST_METHOD = 'GET';
const REQUEST_URI = '/onca/xml';
const ENDPOINT = 'webservices.amazon.com';
const HMAC_ALGORITHM = 'sha256';
const TIMESTAMP_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const canonicalize = (queryObject = {}) => {
  const keys = Object.keys(queryObject);

  if (!keys.length) {
    return '';
  }

  return keys.reduce((canonical, key) => {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(queryObject[key]);

    return `${canonical}&${encodedKey}=${encodedValue}`;
  }, '');
};

export const getSignedUrl = (params) => {
  const urlParams = {
    ...params,
    AWSAccessKeyId: AWS_ACCESS_KEY,
    Timestamp: `${moment.utc().format(TIMESTAMP_FORMAT)}Z`,
  };
  const canonicalQS = canonicalize(urlParams);
  console.log(canonicalQS);
  const toSign = `${REQUEST_METHOD}\n${ENDPOINT}\n${REQUEST_URI}\n${canonicalQS}`;
  const hmac = createHmac(HMAC_ALGORITHM, Buffer.from(AWS_SECRET_KEY))
    .update(toSign)
    .digest('hex');
  const sign = encodeURIComponent(hmac);

  return `https://${ENDPOINT}${REQUEST_URI}?${canonicalQS}&Signature=${sign}`;
};
