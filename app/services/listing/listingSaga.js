import {
  takeEvery,
  put,
  all,
  call,
  select
} from 'redux-saga/effects';
import mime from 'mime-types';
import { FetchChain, hash } from 'omnibazaarjs/es';
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
  reportListingSuccess,
  reportListingError,
  getListingDetailSucceeded,
  getListingDetailFailed,
  requestMyListingsSuccess,
  requestMyListingsError,
  isListingFineSucceeded,
  isListingFineFailed,
  searchPublishersFinish
} from './listingActions';
import { clearSearchResults } from '../search/searchActions';
import {
  countPeersForKeywords
} from '../search/dht/dhtSaga';
import {getAllPublishers, getPublisherByIp} from '../accountSettings/services';
import {
  saveImage,
  deleteImage,
  deleteListingOnPublisher,
  createListingOnPublisher,
  updateListingOnBlockchain,
  ensureListingData,
  checkPublisherAliveStatus,
  createListing,
  editListing,
  getListingFromBlockchain
} from './apis';


export function* listingSubscriber() {
  yield all([
    takeEvery('UPLOAD_LISTING_IMAGE', uploadImage),
    takeEvery('DELETE_LISTING_IMAGE', removeImage),
    takeEvery('SAVE_LISTING', saveListingHandler),
    takeEvery('GET_LISTING_DETAIL', getListingDetail),
    takeEvery('REQUEST_MY_LISTINGS', requestMyListings),
    takeEvery('DELETE_LISTING', deleteMyListing),
    takeEvery('IS_LISTING_FINE', checkListingHash),
    takeEvery('SEARCH_PUBLISHERS', searchPublishers),
    takeEvery('REPORT_LISTING', reportListing)
  ]);
}

export function* uploadImage({ payload: { publisher, file, imageId } }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    yield put(addListingImage(publisher, file, imageId));
    const resultImage = yield call(saveImage, currentUser, publisher, file);
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

export function* removeImage({ payload: { publisher, image } }) {
  const { id, fileName, localFilePath } = image;
  try {
    yield put(startDeleteListingImage(id));
    if (localFilePath && !fileName) {
      yield put(deleteListingImageSuccess(id));
      return;
    }

    const { currentUser } = (yield select()).default.auth;
    const result = yield call(deleteImage, currentUser, publisher, fileName);
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

function* checkAndUploadImages(user, publisher, listing) {
  for (let i = 0; i < listing.images.length; i++) {
    const imageItem = listing.images[i];
    const { localFilePath, path, id } = imageItem;
    if (localFilePath) {
      const type = mime.lookup(path);
      const file = {
        path: localFilePath,
        name: path,
        type
      };
      const result = yield call(saveImage, user, publisher, file);
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
	}
}

function* uploadImagesFromAnotherPublisher(user, oldPublisher, newPublisher, listing) {
  for (let i = 0; i < listing.images.length; ++i) {
    const url = `http://${oldPublisher.publisher_ip}/publisher-images/${listing.images[i].path}`;
    const result = yield call(saveImage, user, newPublisher, {
      name: listing.images[i].path,
      type: mime.lookup(listing.images[i].path),
      url
    });
    console.log('RESULT ', result);
    listing.images[i] = {
      path: result.image,
      thumb: result.thumb,
      image_name: result.fileName
    };
  }
}

function* moveToAnotherPublisher(user, publisher, listing, listingId) {
  const oldPublisher = yield call(getPublisherByIp, listing.ip);
  yield call(uploadImagesFromAnotherPublisher, user, oldPublisher, publisher, listing);
  console.log('DONE UPLOADING');
  yield call(deleteListingOnPublisher, user, oldPublisher, { ...listing, listing_id: listingId });
  listing = ensureListingData(listing);
  console.log("LISTING TO SHOW ", publisher);
  yield call(updateListingOnBlockchain, user, publisher, listingId, listing);
  yield call(createListingOnPublisher, user, listing, publisher, listingId);
}

function* saveListingHandler({ payload: { publisher, listing, listingId } }) {
  let result;
  try {
    const { currentUser } = (yield select()).default.auth;

    // saving take long time and user might logout in the middle of saving,
    // so we need to clone current user object
    const user = { ...currentUser };
    const isPublisherAlive = yield call(checkPublisherAliveStatus, user, publisher);
    if (!isPublisherAlive) {
      throw new Error('publisher_not_alive');
    }

    if (!listing.price_using_btc && listing.currency !== 'BITCOIN') {
      listing = { ...listing };
      delete listing.bitcoin_address;
    }

    if (listingId) {
      if (publisher.publisher_ip !== listing.ip) {
        yield call(moveToAnotherPublisher, user, publisher, listing, listingId);
      } else {
        result = yield call(editListing, user, publisher, listingId, listing);
      }
    } else {
      yield call(checkAndUploadImages, user, publisher, listing);
      result = yield call(createListing, user, publisher, listing);
    }

    if (!listingId) {
      listingId = result.listing_id;
    }

    yield put({ type: 'DHT_RECONNECT' });
    yield put(saveListingSuccess(result, listingId));
  } catch (err) {
    console.log(err);
    yield put(saveListingError(listingId, err));
  }
}

export function* getListingDetail({ payload: { listingId } }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const userAcc = yield call(FetchChain, 'getAccount', currentUser.username);
    let listings = (yield select()).default.search.searchResults;
    let listingDetail = yield call(async () => listings.find(listing => listing.listing_id === listingId));
    if (!listingDetail) {
      listings = (yield select()).default.listing.myListings;
      listingDetail = yield call(async () => listings.find(listing => listing.listing_id === listingId));
    }

    const blockchainListingData = yield call(getListingFromBlockchain, listingId);
    if (!blockchainListingData) {
      listingDetail.existsInBlockchain = false;
      listingDetail.quantity = 0;
    } else {
      listingDetail.existsInBlockchain = true;
      listingDetail.quantity = blockchainListingData.quantity;
      listingDetail.isReportedByCurrentUser = blockchainListingData.reported_accounts.includes(userAcc.get('id'));
    }

    const ownerAcc = yield Apis.instance().db_api().exec('get_account_by_name', [listingDetail.owner]);
    listingDetail.reputationScore = ownerAcc.reputation_unweighted_score;
    listingDetail.reputationVotesCount = ownerAcc.reputation_votes_count;
    if (listingDetail.reputationVotesCount === 0) {
      listingDetail.reputationScore = 5000;
    }

    yield put(getListingDetailSucceeded(listingDetail));
  } catch (error) {
    console.log(error);
    yield put(getListingDetailFailed(error));
  }
}

export function* requestMyListings() {
  try {
    yield put(clearSearchResults());

    const { currentUser } = (yield select()).default.auth;
    const myListings = yield Apis.instance().db_api().exec('get_listings_by_seller', [currentUser.username]);
    const getListingCommands = (yield Promise.all(myListings.map(listing => FetchChain('getAccount', listing.publisher))))
      .map((account, idx) => ({
        listing_id: myListings[idx].id,
        address: account.get('publisher_ip')
      }))
      .filter(el => !!el.address)
      .reduce((arr, curr) => {
        const val = arr.find(el => el.address === curr.address && el.listing_ids.length < 10);
        if (!val) {
          return [
            ...arr,
            {
              address: curr.address,
              listing_ids: [curr.listing_id]
            }
          ];
        }
        val.listing_ids.push(curr.listing_id);
        return arr;
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

export function* deleteMyListing({ payload: { publisher, listing } }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const user = { ...currentUser };
    yield call(deleteListing, user, publisher, listing);
    yield put(deleteListingSuccess(listing.listing_id));
  } catch (err) {
    console.log(err);
    yield put(deleteListingError(listing.listing_id, err));
  }
}

export function* checkListingHash({ payload: { listing } }) {
  try {
    const blockchainListing = (yield Apis.instance().db_api().exec('get_objects', [[listing.listing_id]]))[0];

    if (blockchainListing.listing_hash === hash.listingSHA256(listing)) {
      yield put(isListingFineSucceeded(blockchainListing));
    } else {
      yield put(isListingFineFailed('hash'));
    }
  } catch (error) {
    yield put(isListingFineFailed(error));
  }
}

export function* searchPublishers({ payload: { keywords } }) {
  try {
    const publishers = yield call(getAllPublishers);
    if (!keywords || !keywords.length) {
      yield put(searchPublishersFinish(null, publishers));
      return;
    }

    const peers = yield call(countPeersForKeywords, keywords);
    const results = [];
    const {
      default: {
        account: { ipAddress, publisher },
        auth: { account: { publisher_ip } },
      },
    } = (yield select());

    publishers.forEach((pub) => {
      const result = { ...pub };
      const isAPublisherOnMemory = publisher && ipAddress === pub.publisher_ip;
      const isAPublisherOnAuth = publisher_ip && pub.publisher_ip === publisher_ip;

      if (peers[pub.publisher_ip]) {
        result.listingCount = peers[pub.publisher_ip];
        results.push(result);
      } else if (isAPublisherOnMemory || isAPublisherOnAuth) {
        result.listingCount = 0;
        results.push(result);
      }
    });

    if (!results.length) {
      yield put(searchPublishersFinish(null, publishers));
    } else {
      yield put(searchPublishersFinish(null, results));
    }
  } catch (err) {
    yield put(searchPublishersFinish(err));
  }
}


function* reportListing({ payload: { listingId } }) {
  try {
    yield call(reportListingOnBlockchain, listingId);
    yield put(reportListingSuccess());
  } catch (error) {
    yield put(reportListingError(error.toString()));
  }
}
