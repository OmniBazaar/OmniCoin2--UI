import { createCipher, createDecipher } from 'crypto';
import { writeFileSync, readFileSync } from 'fs';

const ENCRYPTION_PASS = 'omnicoin_omnibazaar';

const encryptData = (data, filePath) => {
  try {
    const cipher = createCipher('aes-256-cbc', ENCRYPTION_PASS);
    const encrypted = Buffer.concat([
      cipher.update(Buffer.from(JSON.stringify(data), 'utf8')),
      cipher.final()
    ]);

    writeFileSync(filePath, encrypted);

    return true;
  } catch (exception) {
    throw new Error(exception.message);
  }
};

const decryptData = (filePath) => {
  try {
    const data = readFileSync(filePath);
    const decipher = createDecipher('aes-256-cbc', ENCRYPTION_PASS);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

    return JSON.parse(decrypted.toString());
  } catch (exception) {
    throw new Error(exception.message);
  }
};

export default {
  encryptData,
  decryptData,
};
