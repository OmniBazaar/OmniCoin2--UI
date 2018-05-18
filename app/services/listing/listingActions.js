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
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  getFavorites
} = createActions({
  GET_LISTING_DETAIL: (listingDetail) => ({ listingDetail }),
  SET_ACTIVE_CURRENCY: (activeCurrency) => ({ activeCurrency }),
  GET_MY_LISTINGS: (myListings) => ({ myListings }),
  SET_BITCOIN_PRICE: () => ({}),
  SET_OMNICOIN_PRICE: () => ({}),
  SET_CONTINUOUS: () => ({}),
  ADD_IMAGE: (image) => ({ image }),
  REMOVE_IMAGE: (imageIndex) => ({ imageIndex }),
  IS_FAVORITE: (listingDetailId) => ({ listingDetailId }),
  ADD_TO_FAVORITES: (listingDetail) => ({ listingDetail }),
  REMOVE_FROM_FAVORITES: (listingDetailId) => ({ listingDetailId }),
  GET_FAVORITES: () => ({}),
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
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  getFavorites
};
