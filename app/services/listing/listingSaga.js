import {
  takeEvery,
  put,
  all,
  call
} from 'redux-saga/effects';
import mime from 'mime-types';
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
  requestMyListingsSuccess,
  requestMyListingsError
} from './listingActions';
import {
  saveImage,
  deleteImage,
  createListing,
  editListing,
  deleteListing,
  getMyListings
} from './apis';

export function* listingSubscriber() {
  yield all([
    takeEvery('UPLOAD_LISTING_IMAGE', uploadImage),
    takeEvery('DELETE_LISTING_IMAGE', removeImage),
    takeEvery('SAVE_LISTING', saveListingHandler),
    takeEvery('REQUEST_MY_LISTINGS', requestMyListings)
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
  const { id, fileName, localFilePath } = image;
  try {
    yield put(startDeleteListingImage(id));
    if (localFilePath && !fileName) {
    	yield put(deleteListingImageSuccess(id));
    	return;
    }

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

function* checkAndUploadImages(listing) {
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
			const result = yield call(saveImage, file);
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

function* saveListingHandler({ payload: { listing, listingId } }) {
  let result;
  try {
    if (listingId) {
      result = yield call(editListing, listingId, listing);
    } else {
    	yield checkAndUploadImages(listing);
    	console.log(listing);
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

function* requestMyListings() {
	try {
		const myListings = yield call(getMyListings);
		yield put(requestMyListingsSuccess(myListings));
	} catch (err) {
		yield put(requestMyListingsError(err));
	}
}
