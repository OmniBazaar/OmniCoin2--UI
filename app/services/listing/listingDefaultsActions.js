import { createActions } from 'redux-actions';

const {
  setBitcoinPriceDefaults,
  setOmnicoinPriceDefaults,
  addImageDefaults,
  removeImageDefaults
} = createActions({
  SET_BITCOIN_PRICE_DEFAULTS: () => ({}),
  SET_OMNICOIN_PRICE_DEFAULTS: () => ({}),
  ADD_IMAGE_DEFAULTS: (image) => ({ image }),
  REMOVE_IMAGE_DEFAULTS: (imageIndex) => ({ imageIndex }),
});

export {
  setBitcoinPriceDefaults,
  setOmnicoinPriceDefaults,
  addImageDefaults,
  removeImageDefaults
};
