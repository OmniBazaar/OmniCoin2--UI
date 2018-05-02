import { createActions } from 'redux-actions';

const {
  getListingDetail,
  setActiveCurrency,
  getMyListings,
  setBitcoinPrice,
  setOmnicoinPrice,
  setContinuous,
  addImage,
  removeImage,
} = createActions({
  GET_LISTING_DETAIL: (listingDetail) => ({ listingDetail }),
  SET_ACTIVE_CURRENCY: (activeCurrency) => ({ activeCurrency }),
  GET_MY_LISTINGS: (myListings) => ({ myListings }),
  SET_BITCOIN_PRICE: () => ({}),
  SET_OMNICOIN_PRICE: () => ({}),
  SET_CONTINUOUS: () => ({}),
  ADD_IMAGE: (image) => ({ image }),
  REMOVE_IMAGE: (imageIndex) => ({ imageIndex }),
});

export {
  getListingDetail,
  setActiveCurrency,
  getMyListings,
  setBitcoinPrice,
  setOmnicoinPrice,
  setContinuous,
  addImage,
  removeImage,
};
