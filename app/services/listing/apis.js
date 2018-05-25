import request from 'request-promise-native';
import fs from 'fs';
import { Signature } from 'omnibazaarjs';
import { generateKeyFromPassword } from '../blockchain/utils/wallet';
import { getStoredCurrentUser } from '../blockchain/auth/services';

let authHeaders = null;

const getAuthHeaders = () => {
	return new Promise((resolve, reject) => {
		if (!authHeaders) {
			const user = getStoredCurrentUser();
			const key = generateKeyFromPassword(user.username, 'active', user.password);
			setTimeout(() => {
				//heavy operation
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
}

const getPubliser = async () => {
	// return 'http://127.0.0.1:8181';
	return 'http://35.171.116.3/pub-api';
}

const makeRequest = async (url, options) => {
	const publiser = await getPubliser();
	const authHeaders = await getAuthHeaders();

	let opts = {
		uri: `${publiser}/${url}`,
		...options,
		headers: {
			...options.headers,
			...authHeaders
		}
	};

	return await request(opts);
}

export const saveImage = async file => {
	let options = {
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
	const body = await makeRequest('images', options);
	return JSON.parse(body);
}

export const deleteImage = async (fileName) => {
	let options = {
		method: 'DELETE',
		json: true
	};

	const body = await makeRequest(`images/${fileName}`, options);
	
	return body;
}

export const createListing = async (listing) => {
	let options = {
		method: 'POST',
		json: true,
		body: {
			...listing,
			listing_type: 'Listing',
			listing_uuid: 'testuuid'
		}
	};

	const body = await makeRequest('listings', options);
	return body;
}

export const editListing = async (listingId, listing) => {
	let options = {
		method: 'PUT',
		json: true,
		body: {
			...listings
		}
	};

	const body = await makeRequest(`listings/${listingId}`, options);
	return body;
}

export const deleteListing = async (listingId) => {
	let options = {
		method: 'DELETE',
		json: true
	};

	const body = await makeRequest(`listings/${listingId}`, options);
	return body;
}