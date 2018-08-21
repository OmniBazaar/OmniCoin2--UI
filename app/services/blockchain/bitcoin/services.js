import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { FetchChain } from 'omnibazaarjs/es';
import _ from 'lodash';

import { getObjectById } from "../../listing/apis";
import { getUserDataFolder, checkDir, writeFile, isExist, readFile } from '../../fileUtils';
import * as BitcoinApi from './BitcoinApi';
import { OB_FEE_MAIL_SUBJECT, SATOSHI_IN_BTC } from "../../../utils/constants";
import { sendMail } from "../../mail/utils";
import {getStoredCurrentUser} from "../auth/services";
import BitcoinObFeesHistory from "../../accountSettings/bitcoinHistory";

const algorithm = 'aes-256-ctr';

export const encrypt = (text, key) => {
  const cipher = crypto.createCipher(algorithm, key);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

export const decrypt = (text, key) => {
  const decipher = crypto.createDecipher(algorithm, key);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

export const persitBitcoinWalletData = async (guid, password, account) => {
  const userDataPath = getUserDataFolder();
  const dataFileDir = path.resolve(userDataPath, 'bitcoin');
  await checkDir(dataFileDir);

  const data = {
    guid,
    password
  };
  const dataString = encrypt(JSON.stringify(data), account.password);
  const dataFilePath = path.resolve(dataFileDir, account.username);
  await writeFile(dataFilePath, dataString);
};

export const getBitcoinWalletData = async (account) => {
  try {
    const dataFilePath = path.resolve(getUserDataFolder(), 'bitcoin', account.username);
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
};


export const sendOBFees = async (purchase, guid, password) => {
  const recipients = {};
  const mailList = {};
  const txHistoryItem = {
    obFee: { }
  };
  const [omnibazaar, buyer, seller, listing] = await Promise.all([
    FetchChain('getAccount', 'omnibazaar'),
    FetchChain('getAccount', purchase.buyer),
    FetchChain('getAccount', purchase.seller),
    getObjectById(purchase.listingId)
  ]);
  const [buyerReferrer, sellerReferrer] = await Promise.all([
    FetchChain('getAccount', buyer.get('referrer')),
    FetchChain('getAccount', seller.get('referrer'))
  ]);
  const omnibazaarFee = purchase.amount * listing.priority_fee / 10000 * SATOSHI_IN_BTC;
  if (omnibazaarFee >= 1000) {
    recipients[omnibazaar.get('btc_address')] = omnibazaarFee;
    mailList[omnibazaar.get('name')] = {
      obFee: {
        omnibazaar_fee: omnibazaarFee
      }
    };
    txHistoryItem.obFee.omnibazaar_fee = omnibazaarFee;
  }
  const referrerFee = purchase.amount * 0.0025 * SATOSHI_IN_BTC;
  if (seller.get('is_referrer') && referrerFee >= 1000) {
    if (buyerReferrer.get('is_referrer') && buyerReferrer.get('btc_address')) {
      recipients[buyerReferrer.get('btc_address')] = referrerFee;
      mailList[buyerReferrer.get('name')] = {
        obFee: {
          referrer_buyer_fee: referrerFee
        }
      };
      txHistoryItem.obFee.referrer_buyer_fee = referrerFee;
    }
    if (sellerReferrer.get('is_referrer') && sellerReferrer.get('btc_address')) {
      recipients[sellerReferrer.get('btc_address')] = referrerFee;
      mailList[sellerReferrer.get('name')] = {
        obFee: {
          referrer_seller_fee: referrerFee
        }
      };
      txHistoryItem.obFee.referrer_seller_fee = referrerFee;
    }
  }
  if (!_.isEmpty(recipients)) {
    const result =  await BitcoinApi.sendToMany(guid, password, recipients, 1);
    Object.keys(mailList).forEach(key => {
      mailList[key].hash = result.tx_hash;
      mailList[key].currency = 'BTC';
    });
    txHistoryItem.hash = result.tx_hash;
    txHistoryItem.currency = 'BTC';
    saveTxHistoryItem(txHistoryItem);
    sendObFeeMails(seller.get('name'), mailList);
  }
};

const saveTxHistoryItem = (txHistoryItem) => {
  const currentUser = getStoredCurrentUser();
  const bitcoinHistory = new BitcoinObFeesHistory(currentUser.username);
  bitcoinHistory.add(txHistoryItem);
};

const sendObFeeMails = (from, mailList) => {
  Object.keys(mailList).forEach(recipient => {
    sendMail(from, recipient, OB_FEE_MAIL_SUBJECT, JSON.stringify(mailList[recipient]));
  });
};
