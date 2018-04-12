import { handleActions } from 'redux-actions';
import {
  setBitcoinPriceDefaults,
  setOmnicoinPriceDefaults,
  addImageDefaults,
  removeImageDefaults
} from './listingDefaultsActions';

const defaultState = {
  bitcoinPriceDefaults: false,
  omnicoinPriceDefaults: false,
  addedImagesDefaults: []
};

const reducer = handleActions({
  [setBitcoinPriceDefaults](state) {
    return {
      ...state,
      bitcoinPriceDefaults: !state.bitcoinPriceDefaults
    };
  },
  [setOmnicoinPriceDefaults](state) {
    return {
      ...state,
      omnicoinPriceDefaults: !state.omnicoinPriceDefaults
    };
  },
  [addImageDefaults](state, { payload: { image } }) {
    return {
      ...state,
      addedImagesDefaults: [...state.addedImagesDefaults, image]
    };
  },
  [removeImageDefaults](state, { payload: { imageIndex } }) {
    return {
      ...state,
      addedImagesDefaults: [
        ...state.addedImagesDefaults.slice(0, imageIndex),
        ...state.addedImagesDefaults.slice(imageIndex + 1)
      ],
    };
  },
}, defaultState);

export default reducer;
