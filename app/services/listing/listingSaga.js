import {
  takeEvery,
  put,
  all,
  call,
  select,
  race
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
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
  startUploadListingImage,
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
  searchPublishersFinish,
  awaitListingDetail,
  checkPublishersAliveFinish
} from './listingActions';
import { clearSearchResults } from '../search/searchActions';
import { countPeersForKeywords } from '../search/dht/dhtSaga';
import { getAllPublishers, getPublisherByIp } from '../accountSettings/services';
import {
  saveImage,
  deleteImage,
  deleteListingOnPublisher,
  createListingOnPublisher,
  updateListingOnBlockchain,
  ensureListingData,
  checkPublisherAliveStatus,
  createListing,
  deleteListing,
  editListing,
  getObjectById,
  reportListingOnBlockchain,
  getAuthHeaders
} from './apis';

const publishersAliveStatusCheckInterval = 600 * 1000;

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
    takeEvery('REPORT_LISTING', reportListing),
    takeEvery('MARKETPLACE_RETURN_LISTINGS', marketplaceReturnListings),
    takeEvery('CHECK_PUBLISHERS_ALIVE', checkPublishersAlive)
  ]);
}

export function* uploadImage({ payload: { publisher, file, imageId } }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    yield put(addListingImage(file, imageId));
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

function* uploadLocalFile(imageId, user, publisher, localFilePath, path) {
  const type = mime.lookup(path);
  const file = {
    path: localFilePath,
    name: path,
    type
  };
  return yield call(uploadFile, imageId, user, publisher, file);
}

function* uploadFile(imageId, user, publisher, file) {
  try{
    yield put(startUploadListingImage(imageId));
    const result = yield call(saveImage, user, publisher, file);
    yield put(uploadListingImageSuccess(
      imageId,
      result.image,
      result.thumb,
      result.fileName
    ));
    return {
      path: result.image,
      thumb: result.thumb,
      image_name: result.fileName
    };
  } catch (err) {
    console.log(err);
    yield put(uploadListingImageError(imageId, err));
    return {
      error: err
    };
  }
}

function* checkAndUploadImages(user, publisher, listing, oldPublisher) {
  const results = yield all(listing.images.map((imageItem) => {
    const { localFilePath, path, file, id } = imageItem;
    if (localFilePath) {
      return call(uploadLocalFile, id, user, publisher, localFilePath, path);
    } else if (file) {
      return call(uploadFile, id, user, publisher, file);
    } else {
      if (!oldPublisher) {
        const img = { ...imageItem };
        delete img.id;
        return img;
      }

      const url = `http://${oldPublisher.publisher_ip}/publisher-images/${imageItem.path}`;
      const nFile = {
        name: imageItem.path,
        type: mime.lookup(imageItem.path),
        url
      };
      return call(uploadFile, id, user, publisher, nFile);
    }
  }));

  for (let i = 0; i < results.length; i++) {
    if (results[i].error) {
      throw new Error('Upload image error: ' + results[i].error);
    }
  }

  return results;
}

function* moveToAnotherPublisher(user, publisher, listing, listingId) {
  const oldPublisher = yield call(getPublisherByIp, listing.ip);
  listing.images = yield call(checkAndUploadImages, user, publisher, listing, oldPublisher);
  yield call(deleteListingOnPublisher, user, oldPublisher, { ...listing, listing_id: listingId });
  listing = ensureListingData(listing);
  yield call(updateListingOnBlockchain, user, publisher, listingId, listing);
  return yield call(createListingOnPublisher, user, listing, publisher, listingId);
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

    if (!listing.price_using_eth && listing.currency !== 'ETHEREUM') {
      listing = { ...listing };
      delete listing.ethereum_address;
    }

    if (listingId) {
      if (publisher.publisher_ip !== listing.ip) {
        result = yield call(moveToAnotherPublisher, user, publisher, listing, listingId);
      } else {
        listing.images = yield call(checkAndUploadImages, user, publisher, listing);
        result = yield call(editListing, user, publisher, listingId, listing);
      }
    } else {
      listing.images = yield call(checkAndUploadImages, user, publisher, listing);
      result = yield call(createListing, user, publisher, listing);
    }

    if (!listingId) {
      listingId = result.listing_id;
    }

    result.ip = publisher.publisher_ip;

    yield put({ type: 'DHT_RECONNECT' });
    yield put(saveListingSuccess(result, listingId));
  } catch (err) {
    console.log(err);
    yield put(saveListingError(listingId, err));
  }
}

export function* getListingDetail({ payload: { listingId } }) {
  try {
    const blockchainListingData = yield call(getObjectById, listingId);
    const publisherAcc = yield call(FetchChain, 'getAccount', blockchainListingData.publisher);
    const id = getNewId().toString();
    const message = {
      id: id,
      type: messageTypes.MARKETPLACE_GET_LISTING,
      command: {
        publishers: [{
          address: publisherAcc.get('publisher_ip'),
          listing_ids: [listingId]
        }]
      }
    };
    ws.send(JSON.stringify(message));
    yield put(awaitListingDetail(listingId, id));
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
    const publisherResults = yield call(getAllPublishers);
    const allPublishers = (yield select()).default.listing.allPublishers.publishers;
    let publishers = [...allPublishers];
    const existPublishers = {};
    publishers.forEach(pub => {
      existPublishers[pub.publisher_ip] = true;
    });
    const tasks = [];
    const { currentUser } = (yield select()).default.auth;
    const user = { ...currentUser }; 
    publisherResults.forEach(pub => {
      if (!existPublishers[pub.publisher_ip]) {
        pub.alive = true;
        publishers.push(pub);
        tasks.push(call(checkPublisherAlive, user, pub));
      }
    });
    if (tasks.length) {
      yield all(tasks);
      yield put(checkPublishersAliveFinish(null, publishers));
    }

    publishers = publishers.filter(pub => pub.alive);

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


function* checkPublisherAlive(user, publisher) {
  const {status, timeout} = yield race({
    status: call(checkPublisherAliveStatus, user, publisher),
    timeout: delay(6000)
  });
  if (typeof status !== 'undefined') {
    publisher.alive = status;
  } else {
    publisher.alive = false;
  }
}

function* checkPublishersAlive() {
  try {
    const { currentUser } = (yield select()).default.auth;
    if (!currentUser) {
      yield put(checkPublishersAliveFinish(null, []));
      return;
    }
    const user = { ...currentUser }; 
    yield call(getAuthHeaders, user);

    const publishers = yield call(getAllPublishers);
    
    const tasks = publishers.map(pub => {
      return call(checkPublisherAlive, user, pub);
    });

    yield all(tasks);
    yield put(checkPublishersAliveFinish(null, publishers));
  } catch (err) {
    console.log(err);
    yield put(checkPublishersAliveFinish(err));
  } finally {
    yield delay(publishersAliveStatusCheckInterval);
    yield put({ type: 'CHECK_PUBLISHERS_ALIVE' })
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

function* marketplaceReturnListings({ data }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const userAcc = yield call(FetchChain, 'getAccount', currentUser.username);
    const listingsObj = JSON.parse(data.command.listings);
    const { listingDetailRequest } = (yield select()).default.listing;
    if (!!listingsObj.listings && data.id === listingDetailRequest.wsMessageId) {
      const listingDetail = listingsObj.listings[0];
      listingDetail.ip = data.command.address;
      const blockchainListingData = yield call(getObjectById, listingDetailRequest.listingId);

      if (!blockchainListingData) {
        listingDetail.existsInBlockchain = false;
        listingDetail.quantity = 0;
      } else {
        listingDetail.existsInBlockchain = true;
        listingDetail.quantity = blockchainListingData.quantity;
        listingDetail.isReportedByCurrentUser = blockchainListingData.reported_accounts.includes(userAcc.get('id'));
      }

      const ownerAcc = yield Apis.instance().db_api().exec('get_account_by_name', [listingDetail.owner]);
      listingDetail.reputationScore = ownerAcc['reputation_unweighted_score'];
      listingDetail.reputationVotesCount = ownerAcc['reputation_votes_count'];
      if (listingDetail.reputationVotesCount === 0) {
        listingDetail.reputationScore = 5000;
      }

      yield put(getListingDetailSucceeded(listingDetail));
    }
  } catch (error) {
      console.log("ERROR ", error);
      yield put(getListingDetailFailed(error));
  }
}
