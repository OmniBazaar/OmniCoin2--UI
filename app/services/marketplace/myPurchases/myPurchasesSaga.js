import {
  takeEvery,
  put,
  all,
  select,
  call
} from 'redux-saga/effects';
import path from 'path';

import OmnicoinHistory from '../../accountSettings/omnicoinHistory';

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

import {
  getUserDataFolder,
  checkDir,
  isExist,
  readFile,
  writeFile
} from "../../fileUtils";
import { getStoredCurrentUser } from "../../blockchain/auth/services";
import { getPublisherByIp } from "../../accountSettings/services";

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
  const publisher = await getPublisherByIp(purchase.ip);
  const purchaseToSave = {
    ...purchase,
    date: new Date(),
    publisher: publisher.name,
    price: purchase.amount,
    count: purchase.listingCount,
    id: purchase.listingId
  };

  delete purchaseToSave.guid;
  delete purchaseToSave.password;
  delete purchaseToSave.toName;
  delete purchaseToSave.amount;
  delete purchaseToSave.listingCount;
  delete purchaseToSave.listingId;
  const content = await readFile(filePath);
  const jsonContent = JSON.parse(content);
  jsonContent.push(purchaseToSave);
  await writeFile(filePath, JSON.stringify(jsonContent, null, 2));
};


export const add = async (purchase, type) => {
  const filePath = await getFilePath(type);
  console.log('FILE PATH ', filePath)
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

function* getSellings() {
  try {
    const filePath = yield call(getFilePath, Types.selling);
    if (isExist(filePath)) {
      const content = yield readFile(filePath);
      const sellings = JSON.parse(content);
      yield put(getMySellingsSucceeded(sellings));
    } else {
      yield put(getMySellingsSucceeded([]));
    }
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
