import request from 'request-promise-native';
import fs from 'fs';
import { Signature } from 'omnibazaarjs';
import { generateKeyFromPassword } from '../blockchain/utils/wallet';
import { getStoredCurrentUser } from '../blockchain/auth/services';

const getAuthHeaders = () => {
	const user = getStoredCurrentUser();
	const key = generateKeyFromPassword(user.username, 'active', user.password);
	const sig = Signature.sign(user.username, key.privKey, key.privKey.toPublicKey());

	return {
		'OB-User': user.username,
		'OB-Signature': sig.toHex()
	};
}

const getPubliser = async () => {
	return 'http://127.0.0.1:8181';
}

export const saveImage = async file => {
	const publiser = await getPubliser();

	let options = {
		method: 'POST',
		uri: `${publiser}/images`,
		headers: getAuthHeaders(),
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

	const body = await request(options);
	return JSON.parse(body);
}

export const deleteImage = async (fileName) => {
	const publiser = await getPubliser();

	let options = {
		method: 'DELETE',
		uri: `${publiser}/images/${fileName}`,
		headers: getAuthHeaders(),
		json: true
	};

	const body = await request(options);
	
	return body;
}

export const createListing = async (listing) => {
	const publiser = await getPubliser();

	let options = {
		method: 'POST',
		uri: `${publiser}/listings`,
		headers: getAuthHeaders(),
		json: true,
		body: {
			...listing,
			listing_type: 'Listing',
			listing_uuid: 'testuuid'
		}
	};

	const body = await request(options);
	return body;
}

export const editListing = async (listingId, listing) => {
	const publiser = await getPubliser();

	let options = {
		method: 'PUT',
		uri: `${publiser}/listings/${listingId}`,
		headers: getAuthHeaders(),
		json: true,
		body: {
			...listings
		}
	};

	const body = await request(options);
	return body;
}

export const deleteListing = async (listingId) => {
	const publiser = await getPubliser();

	let options = {
		method: 'DELETE',
		uri: `${publiser}/listings/${listingId}`,
		headers: getAuthHeaders(),
		json: true
	};

	const body = await request(options);
	return body;
}