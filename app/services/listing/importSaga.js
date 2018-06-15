import { all, call, put, takeLatest } from 'redux-saga/effects';
import { generate } from 'shortid';
import fs from 'fs';

import { getListings } from './../../utils/listings';
import { createListing, saveImage } from './apis';
import { getImageFromAmazon } from './../../utils/images';

export function* importSubscriber() {
  yield all([
    takeLatest('STAGE_FILE', importListingsFromFile),
    takeLatest('IMPORT_FILES', saveFiles),
  ]);
}

export function* importListingsFromFile({ payload: { file, defaultValues } }) {
  try {
    const { content, name } = file;
    const listings = yield call(getListings, content);

    const items = yield listings.map(async (item) => {
      let imageToSave;
      const itemToSave = {
        ...item,
        end_date: item.end_date || item.start_date,
        name: item.name || item.listing_title,
      };

      if (!itemToSave.imageURL) {
        imageToSave = await getImageFromAmazon(itemToSave.productId);
      } else {
        imageToSave = (await fetch(itemToSave.imageURL)).blob();
      }

      imageToSave.name = `${generate()}-${itemToSave.productId}.${imageToSave.type.split('/')[1]}`;
      imageToSave.path = `tmp/${imageToSave.name}`;
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
      file: { items, title: name, display: false }
    });
  } catch (e) {
    yield put({ type: 'STAGING_FILE_FAILED', error: e.message });
  }
}

export function* saveFiles({ payload: { publisher, filesToImport } }) {
  try {
    const allFiles = filesToImport.map(async (file) => {
      const newFile = { ...file, display: true };

      const newItems = newFile.items.map(async (item) => {
        const { image, fileName, thumb } = await saveImage(publisher, item.images[0]);
        const itemToSave = { ...item };

        if (item.images[0].path) {
          fs.unlink(item.images[0].path, console.log);
        }

        delete itemToSave.productId;
        delete itemToSave.imageURL;

        return createListing(publisher, {
          ...itemToSave,
          images: [{
            thumb,
            image_name: fileName,
            path: image,
          }],
        });
      });

      newFile.items = await Promise.all(newItems);

      return newFile;
    });

    const importedFiles = yield Promise.all(allFiles);

    yield put({ type: 'DHT_RECONNECT' });
    yield put({ type: 'IMPORT_FILES_SUCCEEDED', importedFiles });
  } catch (e) {
    yield put({ type: 'IMPORT_FILES_FAILED', error: e.message });
  }
}
