import request from 'request-promise-native';
import fs from 'fs';
import { Signature } from 'omnibazaarjs';
import { hash } from 'omnibazaarjs/es';
import { Apis } from 'omnibazaarjs-ws';
import {
  FetchChain,
  TransactionBuilder
} from 'omnibazaarjs/es';

import { generateKeyFromPassword } from '../blockchain/utils/wallet';
import { getStoredCurrentUser } from '../blockchain/auth/services';
import {currencyConverter} from "../utils";
import {TOKENS_IN_XOM} from "../../utils/constants";
import tmp from 'tmp';


let authUser = null;
let authHeaders = null;

const listingProps = [
  'listing_title', 'listing_type', 'listing_id', 'category',
  'subcategory', 'price', 'currency', 'price_using_btc',
  'bitcoin_address',  'price_using_eth', 'ethereum_address', 'price_using_omnicoin', 'condition',
  'quantity', 'units', 'start_date', 'end_date', 'continuous',
  'images', 'description', 'keywords', 'name', 'contact_type',
  'contact_info', 'country', 'address', 'city', 'post_code',
  'state', 'owner', "priority_fee"
];


const getAuthHeaders = (currentUser) => new Promise((resolve, reject) => {
  // let user = getStoredCurrentUser();
  const user = currentUser;

  if (!authHeaders || !authUser || (authUser.username !== user.username)) {
    authUser = user;

    const key = generateKeyFromPassword(user.username, 'active', user.password);
    setTimeout(() => {
      // heavy operation
      const sig = Signature.sign(user.username, key.privKey, key.privKey.toPublicKey());
      authHeaders = {
        'OB-User': user.username,
        'OB-Signature': sig.toHex()
      };
      resolve(authHeaders);
    }, 1);
  } else {
    resolve(authHeaders);
  }
});


const makeRequest = async (user, publisher, url, options) => {
  const authHeaders = await getAuthHeaders(user);
  const opts = {
    uri: `http://${publisher.publisher_ip}/pub-api/${url}`,
    ...options,
    headers: {
      ...options.headers,
      ...authHeaders
    }
  };
  return await request(opts);
};

export const saveImage = async (user, publisher, file) => {
  let value;
  const tmpObj = tmp.fileSync();
  if (file.url) {
    await new Promise(resolve =>
      request(file.url)
        .pipe(fs.createWriteStream(tmpObj.name))
        .on('finish', resolve));
    value = fs.createReadStream(tmpObj.name);
  } else {
    value = fs.createReadStream(file.localPath || file.path);
  }
  const options = {
    method: 'POST',
    formData: {
      image: {
        value: value,
        options: {
          filename: file.name,
          contentType: file.type
        }
      }
    }
  };
  const body = await makeRequest(user, publisher, 'images', options);
  tmpObj.removeCallback();
  return JSON.parse(body);
};

export const deleteImage = async (user, publisher, fileName) => {
  const options = {
    method: 'DELETE',
    json: true
  };

  const body = await makeRequest(user, publisher, `images/${fileName}`, options);

  return body;
};

const createListingOnBlockchain = async (user, publisher, listing) => {
  const seller = await FetchChain('getAccount', user.username);
  const key = generateKeyFromPassword(user.username, 'active', user.password);
  const tr = new TransactionBuilder();
  const listingHash = hash.listingSHA256({
    ...listing,
    owner: user.username
  });
  tr.add_type_operation('listing_create_operation', {
    seller: seller.get('id'),
    price: {
      asset_id: '1.3.0',
      amount: Math.ceil(currencyConverter(parseFloat(listing.price), listing.currency, 'OMNICOIN') * TOKENS_IN_XOM)
    },
    quantity: parseInt(listing.quantity),
    listing_hash: listingHash,
    publisher: publisher.id,
    priority_fee: parseInt(listing.priority_fee)
  });
  await tr.set_required_fees();
  await tr.add_signer(key.privKey, key.pubKey);
  const result = await tr.broadcast();
  return result[0].trx.operation_results[0][1]; // listing id
};

const deleteListingOnBlockchain = async (user, listing) => {
  const tr = new TransactionBuilder();
  const ownerAcc = await FetchChain('getAccount', listing.owner);
  tr.add_type_operation('listing_delete_operation', {
    seller: ownerAcc.get('id'),
    listing_id: listing.listing_id
  });
  const key = generateKeyFromPassword(user.username, 'active', user.password);
  await tr.set_required_fees();
  await tr.add_signer(key.privKey, key.pubKey);
  await tr.broadcast();
};

export const reportListingOnBlockchain = async (listingId) => {
  const user = getStoredCurrentUser();
  const tr = new TransactionBuilder();
  const userAcc = await FetchChain('getAccount', user.username);
  tr.add_type_operation('listing_report_operation', {
    reporting_account: userAcc.get('id'),
    listing_id: listingId
  });
  const key = generateKeyFromPassword(user.username, 'active', user.password);
  await tr.set_required_fees();
  await tr.add_signer(key.privKey, key.pubKey);
  await tr.broadcast();
};

export const updateListingOnBlockchain = async (user, publisher, listingId, listing) => {
  const seller = await FetchChain('getAccount', user.username);
  const blockchainListing = await getListingFromBlockchain(listingId);
  const key = generateKeyFromPassword(user.username, 'active', user.password);
  const tr = new TransactionBuilder();
  const listingHash = hash.listingSHA256({
    ...listing,
    owner: user.username
  });
  const operation = {
    seller: seller.get('id'),
    listing_id: listingId,
    price: {
      asset_id: '1.3.0',
      amount: Math.ceil(currencyConverter(parseFloat(listing.price), listing.currency, 'OMNICOIN') * TOKENS_IN_XOM)
    },
    quantity: parseInt(listing.quantity),
    publisher: publisher.id,
    update_expiration_time: true,
    priority_fee: parseInt(listing.priority_fee)
  };
  if (listingHash !== blockchainListing.listing_hash) {
    operation.listing_hash = listingHash;
  }
  tr.add_type_operation('listing_update_operation', operation);
  await tr.set_required_fees();
  await tr.add_signer(key.privKey, key.pubKey);
  await tr.broadcast();
};

export const getListingFromBlockchain = async listingId => {
  const listing = await Apis.instance().db_api().exec('get_objects', [[listingId]]);
  if (listing) {
    return listing[0];
  }
  return null;
};

export const ensureListingData = listing => {
  const result = {};
  listingProps.forEach(key => {
    if (listing[key]) {
      result[key] = listing[key];
    }
  });

  return result;
};

export const createListingOnPublisher = async (user, listing, publisher, listingId) => {
  const newListing = { ...ensureListingData(listing) };
  const options = {
    method: 'POST',
    json: true,
    body: {
      ...newListing,
      listing_type: 'Listing',
      listing_id: listingId
    }
  };
  return await makeRequest(user, publisher, 'listings', options);
};

export const createListing = async (user, publisher, listing) => {
  listing = ensureListingData(listing);
  const listingId = await createListingOnBlockchain(user, publisher, listing);
  return await createListingOnPublisher(user, listing, publisher, listingId)
};

export const editListing = async (user, publisher, listingId, listing) => {
  listing = ensureListingData(listing);
  const blockchainListing = await getListingFromBlockchain(listingId);
  if (!blockchainListing) {
    throw new Error('Listing not exist on blockchain');
  }
  if (blockchainListing.listing_hash === hash.listingSHA256(listing)) {
    throw new Error('no_changes');
  }

  await updateListingOnBlockchain(user, publisher, listingId, listing);
  const options = {
    method: 'PUT',
    json: true,
    body: {
      ...listing,
      listing_type: 'Listing',
      listing_id: listingId
    }
  };
  return await makeRequest(user, publisher, `listings/${listingId}`, options);
};

export const deleteListingOnPublisher = async (user, publisher, listing) => {
  const options = {
    method: 'DELETE',
    json: true
  };
  const { listing_id, images } = listing;
  const body = await makeRequest(user, publisher, `listings/${listing_id}`, options);
  if (body.success) {
    for (let i = 0; i < images.length; i++) {
      const imageItem = images[i];
      if (imageItem.image_name) {
        await deleteImage(user, publisher, imageItem.image_name);
      }
    }
  }
  return body;
};

export const deleteListing = async (user, publisher, listing) => {
  await deleteListingOnBlockchain(user, listing);
  return await deleteListingOnPublisher(user, publisher, listing);
};

export const checkPublisherAliveStatus = async (user, publisher) => {
  try {
    const options = {
      method: 'GET',
      json: true
    };
    const alive = await makeRequest(user, publisher, 'alive/status', options);
    return alive.ok;
  } catch (err) {
    console.log('Check publisher alive error', err);
    return false;
  }
};

