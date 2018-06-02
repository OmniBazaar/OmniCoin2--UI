import {
  takeEvery,
  put,
  all,
  call,
  select
} from 'redux-saga/effects';
import mime from 'mime-types';
import { Apis } from 'omnibazaarjs-ws';

import {
  addListingImage,
  uploadListingImageSuccess,
  uploadListingImageError,
  startDeleteListingImage,
  deleteListingImageSuccess,
  deleteListingImageError,
  saveListingSuccess,
  saveListingError,
  deleteListingSuccess,
  deleteListingError,
  getListingDetailSucceeded,
  getListingDetailFailed,
  requestMyListingsSuccess,
  requestMyListingsError,
  isListingFine,
  isListingFineSucceeded,
  isListingFineFailed
} from './listingActions';
import {
  saveImage,
  deleteImage,
  createListing,
  editListing,
  deleteListing,
  getMyListings
} from './apis';
import {getListingHash} from "./utils";

export function* listingSubscriber() {
  yield all([
    takeEvery('UPLOAD_LISTING_IMAGE', uploadImage),
    takeEvery('DELETE_LISTING_IMAGE', removeImage),
    takeEvery('SAVE_LISTING', saveListingHandler),
    takeEvery('GET_LISTING_DETAIL', getListingDetail),
    takeEvery('REQUEST_MY_LISTINGS', requestMyListings),
    takeEvery('DELETE_LISTING', deleteMyListing),
    takeEvery('IS_LISTING_FINE', checkListingHash)
  ]);
}

function* uploadImage({ payload: { publisher, file, imageId } }) {
  try {
    yield put(addListingImage(publisher, file, imageId));
    const resultImage = yield call(saveImage, publisher, file);
    yield put(uploadListingImageSuccess(
      imageId,
      resultImage.image,
      resultImage.thumb,
      resultImage.fileName
    ));
  } catch (err) {
    yield put(uploadListingImageError(imageId, err));
  }
}

function* removeImage({ payload: { publisher, image } }) {
  const { id, fileName, localFilePath } = image;
  try {
    yield put(startDeleteListingImage(id));
    if (localFilePath && !fileName) {
    	yield put(deleteListingImageSuccess(id));
    	return;
    }

    const result = yield call(deleteImage, publisher, fileName);
    if (result.success) {
      yield put(deleteListingImageSuccess(id));
    } else {
      yield put(deleteListingImageError(id, 'Delete image fail'));
    }
  } catch (err) {
    console.log(err);
    yield put(deleteListingImageError(id, err));
  }
}

function* checkAndUploadImages(publisher, listing) {
	for (let i=0; i<listing.images.length; i++) {
		const imageItem = listing.images[i];
		const { localFilePath, path, id } = imageItem;
		if (localFilePath) {
			const type = mime.lookup(path);
			const file = {
				path: localFilePath,
				name: path,
				type
			};
			const result = yield call(saveImage, publisher, file);
			yield put(uploadListingImageSuccess(
	      id,
	      result.image,
	      result.thumb,
	      result.fileName
	    ));
	    listing.images[i] = {
	    	path: result.image,
	    	thumb: result.thumb,
	    	image_name: result.fileName
	    };
		}
	};
}

function* saveListingHandler({ payload: { publisher, listing, listingId } }) {
  let result;
  try {
    if (listingId) {
      result = yield call(editListing, publisher, listingId, listing);
    } else {
    	yield checkAndUploadImages(publisher, listing);
      result = yield call(createListing, publisher, listing);
    }

    if (!listingId) {
      listingId = result.listing_id;
    }
	 	yield put(saveListingSuccess(result, listingId));
  } catch (err) {
    console.log(err);
    yield put(saveListingError(listingId, err));
  }
}

function* getListingDetail({ payload: { listingId }}) {
  try {
    const listings = (yield select()).default.search.searchResults;
    const listingDetail = yield call(async () => listings.find(listing => listing['listing_id'] === listingId));
    yield put(getListingDetailSucceeded(listingDetail));
  } catch (error) {
    console.log('Error ', error);
    yield put(getListingDetailFailed(error));
  }
}

function* requestMyListings() {
	try {
		const myListings = yield call(getMyListings);
		yield put(requestMyListingsSuccess(myListings));
	} catch (err) {
    console.log(err);
		yield put(requestMyListingsError(err));
	}
}

function* deleteMyListing({ payload: { publisher, listing } }) {
  try {
    const result = yield call(deleteListing, publisher, listing);
    yield put(deleteListingSuccess(listing.id));
  } catch (err) {
    console.log(err);
    yield put(deleteListingError(listing.id, err));
  }
}

function* checkListingHash({ payload: { listing } }) {
  try {
    const blockchainListing =  (yield Apis.instance().db_api().exec('get_objects', [[listing.listing_id]]))[0];
    if (blockchainListing.listing_hash === getListingHash(listing)) {
      yield put(isListingFineSucceeded(blockchainListing.quantity));
    } else {
      yield put(isListingFineFailed('hash'));
    }
  } catch (error) {
    yield put(isListingFineFailed(error));
  }
}
