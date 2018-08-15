import { createCipher, createDecipher } from 'crypto';

const ENCRYPTION_PASS = 'omnicoin_omnibazaar';
const ALGORITHM = 'aes-256-cbc';

const encryptDataInStorage = (data, dataIndex) => {
  try {
    const cipher = createCipher(ALGORITHM, ENCRYPTION_PASS);
    const encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');

    localStorage.setItem(dataIndex, `${encrypted}${cipher.final('hex')}`);

    return true;
  } catch (exception) {
    throw new Error(exception.message);
  }
};

const decryptDataFromStorage = (dataIndex) => {
  try {
    const data = localStorage.getItem(dataIndex);

    if (!data) {
      return null;
    }

    const decipher = createDecipher(ALGORITHM, ENCRYPTION_PASS);
    const decrypted = decipher.update(data, 'hex', 'utf8');

    return JSON.parse(`${decrypted}${decipher.final('utf8')}`);
  } catch (exception) {
    throw new Error(exception.message);
  }
};

export default {
  encryptDataInStorage,
  decryptDataFromStorage,
};
