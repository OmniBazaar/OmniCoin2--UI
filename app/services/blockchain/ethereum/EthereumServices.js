import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { getUserDataFolder, checkDir, writeFile, isExist, readFile } from '../../fileUtils';

import _ from 'lodash';
import * as EthereumApi from './EthereumApi';
import { FetchChain } from 'omnibazaarjs/es';
import { getObjectById } from "../../listing/apis";
import {SATOSHI_IN_BTC} from "../../../utils/constants";

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

export const persitEthereumWalletData = async (address, privateKey, brainKey, account) => {
	const userDataPath = getUserDataFolder();
	const dataFileDir = path.resolve(userDataPath, 'ethereum');
	await checkDir(dataFileDir);

	const data = {
		address,
		privateKey,
		brainKey
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

export const sendOBFeesByEth = async (amount, purchaseBuyer, purchaseSeller,purchaseListingId, privateKey) => {
	const [omnibazaar, buyer, seller, listing] = await Promise.all([
	  FetchChain('getAccount', 'omnibazaar'),
	  FetchChain('getAccount', purchaseBuyer),
	  FetchChain('getAccount', purchaseSeller),
	  getObjectById(purchaseListingId)
	]);
	const [buyerReferrer, sellerReferrer] = await Promise.all([
	  FetchChain('getAccount', buyer.get('referrer')),
	  FetchChain('getAccount', seller.get('referrer'))
	]);
	const recipients = [];
	const omnibazaarFee = amount * listing.priority_fee / 10000;
	if (omnibazaar.get('eth_address') && omnibazaarFee > 0) {
	  await EthereumApi.makeEthereumPayment(privateKey, omnibazaar.get('eth_address'), omnibazaarFee);
	}
	const referrerFee = amount * 0.0025;
	if (seller.get('is_referrer') && referrerFee > 0) {
	  if (buyerReferrer.get('is_referrer') && buyerReferrer.get('eth_address')) {
		await EthereumApi.makeEthereumPayment(privateKey, buyerReferrer.get('eth_address'), referrerFee);
	  }
	  if (sellerReferrer.get('is_referrer') && sellerReferrer.get('eth_address')) {
		await EthereumApi.makeEthereumPayment(privateKey, sellerReferrer.get('eth_address'), referrerFee);
	  }
	}
  };
  