import { call, put, takeEvery } from 'redux-saga/effects';
import listings from './../../utils/listings';

const { getListings } = listings;

export function* importSubscriber() {
  yield takeEvery('IMPORT_FILE', importLisingsFromFile);
}

export function* importLisingsFromFile({ payload: { file } }) {
  try {
    const { content, name } = file;
    const listingsResult = yield call(getListings.bind(listings), content);

    yield put({
      type: 'IMPORT_FILE_SUCCEEDED',
      file: {
        title: name, items: listingsResult
      }
    });
  } catch (e) {
    yield put({ type: 'IMPORT_FILE_FAILED', error: e.message });
  }
}
