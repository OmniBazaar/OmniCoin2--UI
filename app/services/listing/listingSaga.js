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
	deleteListingImageError
} from './listingActions';
import { saveImage, deleteImage } from './apis';

export function* listingSubscriber() {
  yield all([
    takeEvery('UPLOAD_LISTING_IMAGE', uploadImage),
    takeEvery('DELETE_LISTING_IMAGE', removeImage)
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