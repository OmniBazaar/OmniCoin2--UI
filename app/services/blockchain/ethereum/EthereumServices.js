import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { getUserDataFolder, checkDir, writeFile, isExist, readFile } from '../../fileUtils';

const algorithm = 'aes-256-ctr';

export const encrypt = (text, key) => {
	const cipher = crypto.createCipher(algorithm, key);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

export const decrypt = (text, key) => {
	const decipher = crypto.createDecipher(algorithm, key);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

export const persitEthereumWalletData = async (address, privateKey, account) => {
	const userDataPath = getUserDataFolder();
	const dataFileDir = path.resolve(userDataPath, 'ethereum');
	await checkDir(dataFileDir);

	const data = {
		address,
		privateKey
	};
	
	const dataString = encrypt(JSON.stringify(data), account.password);
	const dataFilePath = path.resolve(dataFileDir, account.username);
	await writeFile(dataFilePath, dataString);
}

export const getEthereumWalletData = async (account) => {
	try {
		const dataFilePath = path.resolve(getUserDataFolder(), 'ethereum', account.username);
		if (!isExist(dataFilePath)) {
			return null;
		}

		const content = await readFile(dataFilePath);
		const decryptedContent = decrypt(content, account.password);
		return JSON.parse(decryptedContent);
	} catch (err) {
		console.log(err);
		return null;
	}
}