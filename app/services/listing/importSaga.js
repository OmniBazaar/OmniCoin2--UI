import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { generate } from 'shortid';
import fs from 'fs';

import { getListings } from './../../utils/listings';
import { createListing, saveImage } from './apis';
import { getImageFromAmazon } from './../../utils/images';

const listingHandlersByVendor = {
  amazon: getListings,
  all: getListings,
};

const imagesDevPath = {
  win32: './app/ob2/windows/',
  linux: './app/ob2/linux/',
  darwin: './app/ob2/mac/',
};

const imagesProdPath = {
  win32: `${process.env.LOCALAPPDATA}/OmniBazaar/`,
  linux: `${process.env.HOME}/.OmniBazaar/`,
  darwin: `${process.env.HOME}/Library/Application Support/OmniBazaar/`,
};

const imageStoragePath = {
  production: imagesProdPath[process.platform],
  development: imagesDevPath[process.platform],
};

const getDefaultListingPriority = ({ username }) => {
  const preferencesStorageKey = `preferences_${username}`;
  const userPreferences = JSON.parse(localStorage.getItem(preferencesStorageKey));
  const hasListingPriority = userPreferences && userPreferences.listingPriority;

  return hasListingPriority ? Number.parseInt(userPreferences.listingPriority, 10) : 50;
};

export function* importSubscriber() {
  yield all([
    takeLatest('STAGE_FILE', importListingsFromFile),
    takeLatest('IMPORT_FILES', saveFiles),
  ]);
}

export function* importListingsFromFile({ payload: { file, defaultValues, vendor } }) {
  try {
    const { content, name } = file;
    const listings = yield call(listingHandlersByVendor[vendor] || getListings, content);
    const { currentUser } = (yield select()).default.auth;

    const items = yield listings.map(async (item) => {
      let imageToSave;
      const itemToSave = {
        ...item,
        end_date: item.end_date || item.start_date,
        name: defaultValues.name,
        priority_fee: getDefaultListingPriority(currentUser),
      };

      if (!itemToSave.imageURL) {
        imageToSave = await getImageFromAmazon(itemToSave.productId);
      } else {
        imageToSave = (await fetch(itemToSave.imageURL)).blob();
      }

      imageToSave.name = `${generate()}-${itemToSave.productId}.${imageToSave.type.split('/')[1]}`;

      const path = process.env.DEBUG_PROD === 'true' ? imageStoragePath.development : imageStoragePath[process.env.NODE_ENV];

      imageToSave.path = `${path}${imageToSave.name}`;
      imageToSave.lastModifiedDate = new Date();

      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onloadend = async () => {
          const imgContent = reader.result.replace(/^data:image\/\w+;base64,/, '');

          fs.writeFileSync(imageToSave.path, Buffer.from(imgContent, 'base64'), { flag: 'w' });

          resolve({
            ...defaultValues,
            ...itemToSave,
            listing_type: 'Listing',
            images: [{
              ...imageToSave,
            }]
          });
        };

        reader.readAsDataURL(imageToSave);
      });
    });

    yield put({
      type: 'STAGING_FILE_SUCCEEDED',
      file: { items, title: name }
    });
  } catch (e) {
    yield put({ type: 'STAGING_FILE_FAILED', error: e.message });
  }
}

export function* saveFiles({ payload: { publisher, filesToImport } }) {
  try {
    const { currentUser } = (yield select()).default.auth;

    const allFiles = filesToImport.map(async (file) => {
      const newFile = { ...file };

      const newItems = newFile.items.map(async (item) => {
        const { image, fileName, thumb } = await saveImage(currentUser, publisher, item.images[0]);
        const itemToSave = { ...item };
        const { localPath, path } = item.images[0];

        if (localPath || path) {
          fs.unlink(localPath || path, console.log);
        }

        delete itemToSave.productId;
        delete itemToSave.imageURL;

        if (!itemToSave.price_using_btc) {
          delete itemToSave.bitcoin_address;
        }

        if (!itemToSave.price_using_eth) {
          delete itemToSave.ethereum_address;
        }

        const listing = await createListing(
          currentUser,
          publisher,
          {
            ...itemToSave,
            images: [{
              thumb,
              image_name: fileName,
              path: image,
            }],
          }
        );

        return {
          ...listing,
          images: [{
            ...listing.images[0],
            localPath: item.images[0].path,
          }]
        };
      });

      newFile.items = await Promise.all(newItems);

      return newFile;
    });

    yield Promise.all(allFiles);

    yield put({ type: 'DHT_RECONNECT' });
    yield put({ type: 'IMPORT_FILES_SUCCEEDED' });
  } catch (e) {
    yield put({ type: 'IMPORT_FILES_FAILED', error: e.message });
  }
}
