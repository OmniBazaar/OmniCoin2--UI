import {
  takeEvery,
  put,
  all,
  call,
  select
} from 'redux-saga/effects';
import path from 'path';
import { FetchChain } from 'omnibazaarjs/es';


import {
  getMyPurchasesSucceeded,
  getMyPurchasesFailed,
  getMySellingsSucceeded,
  getMySellingsFailed,
  addPurchaseFailed,
  addPurchaseSucceeded,
  addSellingSucceeded,
  addSellingFailed
} from './myPurchasesActions';

import OmnicoinHistory from '../../accountSettings/omnicoinHistory';

import {
  getUserDataFolder,
  checkDir,
  isExist,
  readFile,
  writeFile
} from "../../fileUtils";
import { getStoredCurrentUser } from "../../blockchain/auth/services";
import { getObjectById, getListing } from "../../listing/apis";

export const Types = {
  selling: 'selling',
  purchase: 'purchase'
};

const getFolder = (type) => {
  const userDataPath = getUserDataFolder();
  return path.resolve(userDataPath, type);
};

const getFilePath = async (type) => {
  const folder = getFolder(type);
  const currentUser = getStoredCurrentUser();
  await checkDir(folder);
  const fileName = `${currentUser.username}.json`;
  return path.join(folder, fileName);
};

const addPurchaseToFile = async (purchase, filePath) => {
  const listing = await getObjectById(purchase.listingId);
  const publisher = await FetchChain('getAccount', listing.publisher);
  const purchaseToSave = {
    date: new Date(purchase.date),
    publisher: publisher.get('name'),
    price: purchase.amount,
    count: purchase.listingCount,
    listingId: purchase.listingId,
    title: purchase.listingTitle,
    seller: purchase.seller,
    buyer: purchase.buyer,
    currency: purchase.currency
  };
  const content = await readFile(filePath);
  const jsonContent = JSON.parse(content);
  jsonContent.push(purchaseToSave);
  await writeFile(filePath, JSON.stringify(jsonContent, null, 2));
};


export const add = async (purchase, type) => {
  const filePath = await getFilePath(type);
  if (isExist(filePath)) {
    await addPurchaseToFile(purchase, filePath);
  } else {
    await writeFile(filePath, '[]');
    await addPurchaseToFile(purchase, filePath);
  }
};


export function* myPurchasesSubscriber() {
  yield all([
    takeEvery('GET_MY_PURCHASES', getPurchases),
    takeEvery('GET_MY_SELLINGS', getSellings),
    takeEvery('ADD_PURCHASE', addPurchase),
    takeEvery('ADD_SELLING', addSelling)
  ]);
}

function* getPurchases() {
  try {
    const filePath = yield call(getFilePath, Types.purchase);
    if (isExist(filePath)) {
      const content = yield readFile(filePath);
      const purchases = JSON.parse(content);
      yield put(getMyPurchasesSucceeded(purchases));
    } else {
      yield put(getMyPurchasesSucceeded([]));
    }
  } catch (error) {
    console.log('ERROR ', error);
    yield put(getMyPurchasesFailed(error));
  }
}

const getListingsDetail = async (user, listingObjects) => {
  const listingsMap = {};
  listingObjects.forEach(listing => {
    if (!listingsMap[listing.id]) {
      listingsMap[listing.id] = listing;
    }
  });

  await Promise.all(Object.keys(listingsMap).map(async (listingId) => {
    const listing = listingsMap[listingId];
    const publisher = {
      publisher_ip: listing.publisherIp
    };

    let listingDetail = null;
    try {
      listingDetail = await getListing(user, publisher, listing.id);
    } catch (err) {
      console.log(err);
    }

    listingsMap[listingId] = {
      ...listing,
      title: listingDetail ? listingDetail.listing_title : ''
    };
  }));

  return listingObjects.map(listing => ({
    ...listing,
    title: listingsMap[listing.id].title
  }));
}

function * getSellings() {
  try {
    const { currentUser } = (yield select()).default.auth;
    const historyStorage = new OmnicoinHistory(currentUser);
    yield historyStorage.refresh();
    let soldOpers = historyStorage.getSellOperations();
    const soldListings = yield historyStorage.getListingObjects(soldOpers);
    const soldListingsMap = {};
    soldListings.forEach(listing => soldListings[listing.id] = listing);
    let soldItems = soldOpers.map(op => ({
      ...op,
      ...soldListings[op.id]
    }));
    soldItems = yield getListingsDetail({...currentUser}, soldItems);
    soldItems = soldItems.map(item => ({
      listingId: item.id,
      title: item.title,
      date: item.date,
      count: item.count,
      price: item.price,
      publisher: item.publisher,
      buyer: item.from
    }));

    yield put(getMySellingsSucceeded(soldItems));
  } catch (error) {
    console.log('ERROR ', error);
    yield put(getMySellingsFailed(error));
  }
}

function* addPurchase({ payload: { purchase } }) {
  try {
    yield call(add, purchase, Types.purchase);
    yield put(addPurchaseSucceeded());
  } catch (error) {
    console.log(error);
    yield put(addPurchaseFailed(error));
  }
}

function* addSelling({ payload: { selling } }) {
  try {
    yield call(add, selling, Types.selling);
    yield put(addSellingSucceeded);
  } catch (error) {
    console.log(error);
    yield put(addSellingFailed(error));
  }
}
