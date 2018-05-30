import {
  takeEvery,
  put,
  all,
  call
} from 'redux-saga/effects';
import { saveImage, deleteImage } from './listingDefaultsService';
import {
  uploadListingDefaultImageSuccess,
  uploadListingDefaultImageError,
  deleteListingDefaultImageSuccess,
  deleteListingDefaultImageError
} from './listingDefaultsActions';

export function* listingDefaultsSubscriber() {
  yield all([
    takeEvery('UPLOAD_LISTING_DEFAULT_IMAGE', uploadImage),
    takeEvery('DELETE_LISTING_DEFAULT_IMAGE', removeImage),
  ]);
}

function* uploadImage({ payload: { file, imageId } }) {
  try {
    const results = yield call(saveImage, file);
    yield put(uploadListingDefaultImageSuccess(
      imageId,
      results.fileName
    ));
  } catch (err) {
    console.log(err);
    yield put(uploadListingDefaultImageError(imageId, err));
  }
}

function* removeImage({ payload: { image } }) {
  const { path, id } = image;
  try {
    yield call(deleteImage, path);
    yield put(deleteListingDefaultImageSuccess(id));
  } catch (err) {
    console.log(err);
    yield put(deleteListingDefaultImageError(id, err));
  }
}

