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

let authUser = null;
let authHeaders = null;

const getAuthHeaders = () => new Promise((resolve, reject) => {
	const user = getStoredCurrentUser();
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



const makeRequest = async (publisher, url, options) => {
  const authHeaders = await getAuthHeaders();
  const opts = {
    uri: `http://${publisher['publisher_ip']}/pub-api/${url}`,
    ...options,
    headers: {
      ...options.headers,
      ...authHeaders
    }
  };
  return await request(opts);
};

export const saveImage = async (publisher, file) => {
  const options = {
    method: 'POST',
    formData: {
      image: {
        value: fs.createReadStream(file.path),
        options: {
          filename: file.name,
          contentType: file.type
        }
      }
    }
  };
  const body = await makeRequest(publisher, 'images', options);
  return JSON.parse(body);
};

export const deleteImage = async (publisher, fileName) => {
  const options = {
    method: 'DELETE',
    json: true
  };

  const body = await makeRequest(publisher, `images/${fileName}`, options);

  return body;
};

const createListingOnBlockchain = async (publisher, listing) => {
	const user = getStoredCurrentUser();
	const seller = await FetchChain('getAccount', user.username);
  const key = generateKeyFromPassword(user.username, 'active', user.password);
  const tr = new TransactionBuilder();
  tr.add_type_operation('listing_create_operation', {
    seller: seller.get('id'),
    price: {
      asset_id: '1.3.0',
      amount: currencyConverter(parseFloat(listing.price), listing.currency, 'OMC') * 100000
    },
    quantity: parseInt(listing.quantity),
    listing_hash: hash.listingSHA256({
      ...listing,
      owner: user.username
    }),
    publisher: publisher.id
  });
  await tr.set_required_fees();
  await tr.add_signer(key.privKey, key.pubKey);
  const result = await tr.broadcast();
  return result[0].trx.operation_results[0][1]; // listing id
};

const deleteListingOnBlockchain = async (listing) => {
  const user = getStoredCurrentUser();
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

const updateListingOnBlockchain = async (publisher, listingId, listing) => {
  const user = getStoredCurrentUser();
  const seller = await FetchChain('getAccount', user.username);
  const key = generateKeyFromPassword(user.username, 'active', user.password);
  const tr = new TransactionBuilder();
  tr.add_type_operation('listing_update_operation', {
    seller: seller.get('id'),
    listing_id: listingId,
    price: {
      asset_id: '1.3.0',
      amount: currencyConverter(parseFloat(listing.price), listing.currency, 'OMC') * 100000
    },
    quantity: parseInt(listing.quantity),
    listing_hash: hash.listingSHA256({
      ...listing,
      owner: user.username
    }),
    publisher: publisher.id,
    update_expiration_time: true
  });
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
}

export const createListing = async (publisher, listing) => {
  const listingId = await createListingOnBlockchain(publisher, listing);
  const options = {
    method: 'POST',
    json: true,
    body: {
      ...listing,
      listing_type: 'Listing',
      listing_id: listingId
    }
  };
  return await makeRequest(publisher, 'listings', options);
};

export const editListing = async (publisher, listingId, listing) => {
  updateListingOnBlockchain(publisher, listingId, listing);
  const options = {
    method: 'PUT',
    json: true,
    body: {
      ...listing,
      listing_type: 'Listing',
      listing_id: listingId
    }
  };
  delete options.body.type;
  delete options.body.ip;
  delete options.body.reputationScore;
  delete options.body.reputationVotesCount;
  console.log('BODY ', options.body);
  return await makeRequest(publisher, `listings/${listingId}`, options);
};

export const deleteListing = async (publisher, listing) => {
  const options = {
    method: 'DELETE',
    json: true
  };
  await deleteListingOnBlockchain(listing);
  const { listing_id, images } = listing;
  const body = await makeRequest(publisher, `listings/${listing_id}`, options);
  if (body.success) {
    for (let i=0; i<images.length; i++) {
      const imageItem = images[i];
      if (imageItem.image_name) {
        await deleteImage(publisher, imageItem.image_name);
      }
    }
  }

  return body;
};
