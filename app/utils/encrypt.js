import { createCipher, createDecipher } from 'crypto';

const ENCRYPTION_PASS = 'omnicoin_omnibazaar';

const encryptDataInStorage = (data, dataIndex) => {
  try {
    const cipher = createCipher('aes-256-cbc', ENCRYPTION_PASS);
    const encrypted = Buffer.concat([
      cipher.update(Buffer.from(JSON.stringify(data), 'utf8')),
      cipher.final()
    ]);

    localStorage.setItem(dataIndex, encrypted);

    return true;
  } catch (exception) {
    throw new Error(exception.message);
  }
};

const decryptDataFromStorage = (dataIndex) => {
  try {
    const data = localStorage.getItem(dataIndex);
    const decipher = createDecipher('aes-256-cbc', ENCRYPTION_PASS);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

    return JSON.parse(decrypted.toString());
  } catch (exception) {
    throw new Error(exception.message);
  }
};

export default {
  encryptDataInStorage,
  decryptDataFromStorage,
};
