import { call, put, takeEvery } from 'redux-saga/effects';
import { getListings } from './../../utils/listings';
import { createListing } from './apis';

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

    const items = yield* listings.map(item => createListing(item));

    yield put({
      type: 'IMPORT_FILE_SUCCEEDED',
      file: { items, title: name }
    });
  } catch (e) {
    yield put({ type: 'IMPORT_FILE_FAILED', error: e.message });
  }
}
