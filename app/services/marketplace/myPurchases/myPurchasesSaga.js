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
  addPurchaseSucceeded
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

const getPurchasesFolder = () => {
  const userDataPath = getUserDataFolder();
  return path.resolve(userDataPath, 'purchases');
};

const getPurchasesFilePath = async () => {
  const purchasesFolder = getPurchasesFolder();
  const currentUser = getStoredCurrentUser();
  await checkDir(purchasesFolder);
  const fileName = `${currentUser.username}.json`;
  return path.join(purchasesFolder, fileName);
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

export function* myPurchasesSubscriber() {
  yield all([
    takeEvery('GET_MY_PURCHASES', getPurchases),
    takeEvery('GET_MY_SELLINGS', getSellings),
    takeEvery('ADD_PURCHASE', addPurchase)
  ]);
}

function* getPurchases() {
  try {
    const filePath = yield call(getPurchasesFilePath);
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
    const { currentUser } = (yield select()).default.auth;
    const historyStorage = new OmnicoinHistory(currentUser.username);
    yield historyStorage.refresh(currentUser);
    const sellings = yield historyStorage.getSellHistory();
    yield put(getMySellingsSucceeded(sellings));
  } catch (error) {
    console.log('ERROR ', error);
    yield put(getMySellingsFailed(error));
  }
}

function* addPurchase({ payload: { purchase } }) {
  try {
    const filePath = yield call(getPurchasesFilePath);
    if (isExist(filePath)) {
      yield call(addPurchaseToFile, purchase, filePath);
    } else {
      yield call(writeFile, filePath, '[]');
      yield call(addPurchaseToFile, purchase, filePath);
    }
    yield put(addPurchaseSucceeded());
  } catch (error) {
    console.log(error);
    yield put(addPurchaseFailed(error));
  }
}
