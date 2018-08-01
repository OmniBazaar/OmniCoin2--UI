import { TransactionBuilder, FetchChain } from 'omnibazaarjs/es';
import { Apis } from "omnibazaarjs-ws";
import { getStoredCurrentUser } from '../blockchain/auth/services';
import { generateKeyFromPassword } from '../blockchain/utils/wallet';

const storageKey = 'preferences';

export const getPreferences = () => {
  const user = getStoredCurrentUser();
  if (user) {
    const key = `${storageKey}_${user.username}`;
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  }

  return {};
}

export const storePreferences = async (preferences) => {
  const user = getStoredCurrentUser();

  if (user) {
    const preferences_key = `${storageKey}_${user.username}`;
    const account = await Apis.instance().db_api().exec('get_account_by_name', [user.username]);
    const publisher_fee = parseInt(parseFloat(preferences.publisherFee) * 100)
    const escrow_fee = parseInt(parseFloat(preferences.escrowFee) * 100)
    const trObj = {
      publisher_fee,
      escrow_fee
    }

    if (isNaN(publisher_fee)) {
      delete trObj.publisher_fee
    }
    if (isNaN(escrow_fee)) {
      delete trObj.escrow_fee
    }
    // save preferences on local storage
    await localStorage.setItem(preferences_key, JSON.stringify(preferences));
    // save preferences on server
    const tr = new TransactionBuilder();
    tr.add_type_operation('account_update', {
      account: account.id,
      ...trObj
    });
    const key = generateKeyFromPassword(user.username, 'active', user.password);
    await tr.set_required_fees();
    await tr.add_signer(key.privKey, key.pubKey);
    const result = await tr.broadcast();
  }
}

export const getuserPrefereneces = async () => {
  const user = getStoredCurrentUser();
  if (user) {
    const account = await Apis.instance().db_api().exec('get_account_by_name', [user.username]);
    return {
      publisherFee: account.publisher_fee / 100,
      escrowFee: account.escrow_fee / 100
    }
  }
  return {};
}