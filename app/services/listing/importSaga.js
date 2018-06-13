import { call, put, takeLatest } from 'redux-saga/effects';
import { generate } from 'shortid';
import fs from 'fs';

import { getListings } from './../../utils/listings';
import { createListing, saveImage } from './apis';
import { getImageFromAmazon } from './../../utils/images';

export function* importSubscriber() {
  yield takeLatest('IMPORT_FILE', importLisingsFromFile);
}

export function* importLisingsFromFile({ payload: { file, defaultValues } }) {
  try {
    const { content, name, publisher } = file;
    const listings = yield call(getListings, content);

    const items = yield listings.map(async item => {
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

          const { image, fileName, thumb } = await saveImage(publisher, imageToSave);

          fs.unlink(imageToSave.path, console.log);

          delete itemToSave.productId;
          delete itemToSave.imageURL;

          const listing = await createListing(publisher, {
            ...defaultValues,
            ...itemToSave,
            images: [{
              thumb,
              image_name: fileName,
              path: image,
            }],
          });

          resolve(listing);
        };

        reader.readAsDataURL(imageToSave);
      });
    });

    yield put({ type: 'DHT_RECONNECT' });
    yield put({
      type: 'IMPORT_FILE_SUCCEEDED',
      file: { items, title: name }
    });
  } catch (e) {
    yield put({ type: 'IMPORT_FILE_FAILED', error: e.message });
  }
}
