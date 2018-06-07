import {
  takeEvery,
  put,
  all,
  call,
  select
} from 'redux-saga/effects';
import mime from 'mime-types';
import { FetchChain, TransactionBuilder, hash } from 'omnibazaarjs/es';
import { Apis } from 'omnibazaarjs-ws';
import {
  ws,
  getNewId,
  messageTypes
} from '../marketplace/wsSaga';

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
} from './apis';
import {generateKeyFromPassword} from "../blockchain/utils/wallet";

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
    let listings = (yield select()).default.search.searchResults;
    let listingDetail = yield call(async () => listings.find(listing => listing['listing_id'] === listingId));
    if (!listingDetail) {
      listings = (yield select()).default.listing.myListings;
      listingDetail = yield call(async () => listings.find(listing => listing['listing_id'] === listingId));
    }
    const ownerAcc = (yield call(FetchChain, 'getAccount', listingDetail.owner)).toJS();
    listingDetail.reputationScore = ownerAcc['reputation_score'];
    listingDetail.reputationVotesCount = ownerAcc['reputation_votes_count'];
    yield put(getListingDetailSucceeded(listingDetail));
  } catch (error) {
    console.log('Error ', error);
    yield put(getListingDetailFailed(error));
  }
}

function* requestMyListings() {
	try {
    const { currentUser } = (yield select()).default.auth;
		const myListings =  yield Apis.instance().db_api().exec('get_listings_by_seller', [currentUser.username]);
		let getListingCommands = (yield Promise.all(
		  myListings.map(
		    listing => FetchChain('getAccount', listing.publisher)
      )
    )).map((account, idx) => {
      return {
        listing_id: myListings[idx].id,
        address: account.get('publisher_ip')
      }
    }).reduce((arr, curr) => {
      const val = arr.find(el => el.address === curr.address && el.listing_ids.length < 10);
      if (!val) {
        return [
          ...arr,
          {
            address: curr.address,
            listing_ids: [curr.listing_id]
          }
        ]
      } else {
        val.listing_ids.push(curr.listing_id);
        return arr;
      }
    }, []);
		const ids = [];

		getListingCommands.forEach(command => {
		  const id = getNewId();
		  ids.push(id);
		  const message = {
        id: id.toString(),
        type: messageTypes.MARKETPLACE_GET_LISTING,
        command: {
          publishers: [command]
        }
      };
		  console.log('Message ', JSON.stringify(message, null, 2));
		  ws.send(JSON.stringify(message));
    });
    yield put(requestMyListingsSuccess(ids));
	} catch (err) {
    console.log(err);
		yield put(requestMyListingsError(err));
	}
}

function* deleteMyListing({ payload: { publisher, listing } }) {
  try {
    yield call(deleteListing, publisher, listing);
    yield put(deleteListingSuccess(listing.listing_id));
  } catch (err) {
    console.log(err);
    yield put(deleteListingError(listing.listing_id, err));
  }
}

function* checkListingHash({ payload: { listing } }) {
  try {
    const blockchainListing =  (yield Apis.instance().db_api().exec('get_objects', [[listing.listing_id]]))[0];
    if (blockchainListing.listing_hash === hash.listingSHA256(listing)) {
      yield put(isListingFineSucceeded(blockchainListing));
    } else {
      yield put(isListingFineFailed('hash'));
    }
  } catch (error) {
    yield put(isListingFineFailed(error));
  }
}
