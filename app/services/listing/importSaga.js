import { call, put, takeEvery } from 'redux-saga/effects';
import { generate } from 'shortid';
import fs from 'fs';

import { getListings } from './../../utils/listings';
import { createListing, saveImage } from './apis';
import { getImageFromAmazon } from './../../utils/images';

export function* importSubscriber() {
  yield takeEvery('IMPORT_FILE', importLisingsFromFile);
}

export function* importLisingsFromFile({ payload: { file, defaultValues } }) {
  try {
    const { content, name, publisher } = file;
    const listings = yield call(getListings, content);

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
          const imgContent = reader.result.replace(/^data:image\/\w+;base64,/, '');

          fs.writeFileSync(image.path, Buffer.from(imgContent, 'base64'), { flag: 'w' });

          const newImage = await saveImage(publisher, image);

          fs.unlink(image.path, console.log);

          const listing = await createListing({
            ...defaultValues,
            ...item,
            images: [newImage],
          });

          resolve(listing);
        };

        reader.readAsDataURL(image);
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
