import {
  takeEvery,
  put,
  all,
  call
} from 'redux-saga/effects';
import {
	addListingImage,
	uploadListingImageSuccess,
	uploadListingImageError
} from './listingActions';
import { saveImage } from './apis';

export function* listingSubscriber() {
  yield all([
    takeEvery('UPLOAD_LISTING_IMAGE', uploadImage)
  ]);
}

function* uploadImage({ payload: { file, imageId } }) {
	try{
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