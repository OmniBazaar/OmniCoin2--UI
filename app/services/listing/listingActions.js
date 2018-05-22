import { createActions } from 'redux-actions';

const {
  getListingDetail,
  setActiveCurrency,
  getMyListings,
  setBitcoinPrice,
  setOmnicoinPrice,
  setContinuous,
  addListingImage,
  removeListingImage,
  setImages,
  uploadListingImage,
  uploadListingImageSuccess,
  uploadListingImageError
} = createActions({
  GET_LISTING_DETAIL: (listingDetail) => ({ listingDetail }),
  SET_ACTIVE_CURRENCY: (activeCurrency) => ({ activeCurrency }),
  GET_MY_LISTINGS: (myListings) => ({ myListings }),
  SET_BITCOIN_PRICE: () => ({}),
  SET_OMNICOIN_PRICE: () => ({}),
  SET_CONTINUOUS: () => ({}),
  ADD_LISTING_IMAGE: (file, imageId) => ({ file, imageId }),
  REMOVE_LISTING_IMAGE: (imageIndex) => ({ imageIndex }),
  SET_IMAGES: (images) => ({ images }),
  UPLOAD_LISTING_IMAGE: (file, imageId) => ({ file, imageId }),
  UPLOAD_LISTING_IMAGE_SUCCESS: (imageId, image, thumb, fileName) => ({
    imageId,
    image,
    thumb,
    fileName
  }),
  UPLOAD_LISTING_IMAGE_ERROR: (imageId, error) => ({ imageId, error })
});

export {
  getListingDetail,
  setActiveCurrency,
  getMyListings,
  setBitcoinPrice,
  setOmnicoinPrice,
  setContinuous,
  addListingImage,
  removeListingImage,
  setImages,
  uploadListingImage,
  uploadListingImageSuccess,
  uploadListingImageError
};
