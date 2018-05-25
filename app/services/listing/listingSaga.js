import {
  takeEvery,
  put,
  all,
  call
} from 'redux-saga/effects';
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
	deleteListingError
} from './listingActions';
import {
	saveImage,
	deleteImage,
	createListing,
	editListing,
	deleteListing
} from './apis';

export function* listingSubscriber() {
  yield all([
    takeEvery('UPLOAD_LISTING_IMAGE', uploadImage),
    takeEvery('DELETE_LISTING_IMAGE', removeImage),
    takeEvery('SAVE_LISTING', saveListingHandler)
  ]);
}

function* uploadImage({ payload: { file, imageId } }) {
	try {
		yield put(addListingImage(file, imageId));
		const resultImage = yield call(saveImage, file);
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

function* removeImage({ payload: { image } }) {
	const { id, fileName } = image;
	try {
		yield put(startDeleteListingImage(id));
		const result = yield call(deleteImage, fileName);
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

function* saveListingHandler({ payload: { listing, listingId } }) {
	console.log(listing);
	let result;
	try {
		if (listingId) {
			result = yield call(editListing, listingId, listing);
		} else {
			result = yield call(createListing, listing);
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