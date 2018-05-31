import { call, put, takeEvery } from 'redux-saga/effects';
import { generate } from 'shortid';
import fs from 'fs';

import { getListings } from './../../utils/listings';
import { createListing, saveImage } from './apis';
import { getImageFromAmazon } from './../../utils/images';

export function* importSubscriber() {
  yield takeEvery('IMPORT_FILE', importLisingsFromFile);
}

export function* importLisingsFromFile({ payload: { file } }) {
  try {
    const { content, name } = file;
    const listings = yield call(getListings, content);

    // Remember to remove
    yield put({
      type: 'IMPORT_FILE_SUCCEEDED',
      file: { items: listings, title: name }
    });

    const items = yield* listings.map(async item => {
      let image;

      if (!item.imageURL) {
        image = await getImageFromAmazon(item['product-id']);
      } else {
        image = (await fetch(item.imageURL)).blob();
      }

      image.name = `${generate()}-${item['product-id']}.${image.type.split('/')[1]}`;
      image.path = `tmp/${image.name}`;
      image.lastModifiedDate = new Date();

      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onloadend = async () => {
          fs.writeFileSync(image.path, reader.result, { flag: 'w' });

          const listing = await createListing({
            ...item,
            images: [await saveImage(image)],
          });

          fs.unlink(image.path, console.log);

          resolve(listing);
        };

        reader.readAsText(image);
      });
    });

    yield put({
      type: 'IMPORT_FILE_SUCCEEDED',
      file: { items, title: name }
    });
  } catch (e) {
    yield put({ type: 'IMPORT_FILE_FAILED', error: e.message });
  }
}
