import { createActions } from 'redux-actions';

const {
  getListingDetail,
  getListingDetailSucceeded,
  getListingDetailFailed,
  awaitListingDetail,
  isListingFine,
  isListingFineSucceeded,
  isListingFineFailed,
  setActiveCurrency,
  setNumberToBuy,
  requestMyListings,
  requestMyListingsSuccess,
  requestMyListingsError,
  setBitcoinPrice,
  setEthereumPrice,
  setOmnicoinPrice,
  setContinuous,
  addListingImage,
  removeListingImage,
  deleteListingImage,
  startDeleteListingImage,
  deleteListingImageSuccess,
  deleteListingImageError,
  setListingImages,
  startUploadListingImage,
  uploadListingImage,
  uploadListingImageSuccess,
  uploadListingImageError,
  clearListingImageError,
  resetSaveListing,
  saveListing,
  saveListingSuccess,
  saveListingError,
  previewListing,
  previewListingError,
  clearPreviewListing,
  clearPreviewListingError,
  resetDeleteListing,
  deleteListing,
  deleteListingSuccess,
  deleteListingError,
  reportListing,
  reportListingSuccess,
  reportListingError,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  searchPublishers,
  searchPublishersFinish,
  filterMyListings,
  filterFavorites,
  clearMyListings,
  checkPublishersAlive,
  checkPublishersAliveFinish,
  getListingTtl,
  getListingTtlDone
} = createActions({
  GET_LISTING_DETAIL: (listingId) => ({ listingId }),
  GET_LISTING_DETAIL_SUCCEEDED: (listingDetail) => ({ listingDetail }),
  GET_LISTING_DETAIL_FAILED: (error) => ({ error }),
  AWAIT_LISTING_DETAIL: (listingId, wsMessageId) => ({ listingId, wsMessageId }),
  IS_LISTING_FINE: (listing) => ({ listing }),
  IS_LISTING_FINE_SUCCEEDED: (blockchainListing) => ({ blockchainListing }),
  IS_LISTING_FINE_FAILED: (error) => ({ error }),
  SET_ACTIVE_CURRENCY: (activeCurrency) => ({ activeCurrency }),
  SET_NUMBER_TO_BUY: (number) => ({ number }),
  REQUEST_MY_LISTINGS: () => ({}),
  REQUEST_MY_LISTINGS_SUCCESS: (ids) => ({ ids }),
  REQUEST_MY_LISTINGS_ERROR: (error) => ({ error }),
  SET_BITCOIN_PRICE: () => ({}),
  SET_ETHEREUM_PRICE: () => ({}),
  SET_OMNICOIN_PRICE: () => ({}),
  SET_CONTINUOUS: () => ({}),
  ADD_LISTING_IMAGE: (file, imageId) => ({ file, imageId }),
  REMOVE_LISTING_IMAGE: (imageId) => ({ imageId }),
  DELETE_LISTING_IMAGE: (publisher, image) => ({ publisher, image }),
  START_DELETE_LISTING_IMAGE: (imageId) => ({ imageId }),
  DELETE_LISTING_IMAGE_SUCCESS: (imageId) => ({ imageId }),
  DELETE_LISTING_IMAGE_ERROR: (imageId, error) => ({ imageId, error }),
  SET_LISTING_IMAGES: (images) => ({ images }),
  START_UPLOAD_LISTING_IMAGE: (imageId) => ({ imageId }),
  UPLOAD_LISTING_IMAGE: (publisher, file, imageId) => ({ publisher, file, imageId }),
  UPLOAD_LISTING_IMAGE_SUCCESS: (imageId, image, thumb, fileName) => ({
    imageId,
    image,
    thumb,
    fileName
  }),
  UPLOAD_LISTING_IMAGE_ERROR: (imageId, error) => ({ imageId, error }),
  CLEAR_LISTING_IMAGE_ERROR: (imageId) => ({ imageId }),
  RESET_SAVE_LISTING: () => ({}),
  SAVE_LISTING: (publisher, listing, listingId) => ({ publisher, listing, listingId }),
  SAVE_LISTING_SUCCESS: (listing, listingId) => ({ listing, listingId }),
  SAVE_LISTING_ERROR: (listingId, error) => ({ listingId, error }),
  PREVIEW_LISTING: (listing) => ({ listing }),
  PREVIEW_LISTING_ERROR: (err) => ({ err }),
  CLEAR_PREVIEW_LISTING: () => ({}),
  CLEAR_PREVIEW_LISTING_ERROR: (err) => ({ err }),
  RESET_DELETE_LISTING: () => ({}),
  DELETE_LISTING: (publisher, listing) => ({ publisher, listing }),
  DELETE_LISTING_SUCCESS: (listingId) => ({ listingId }),
  DELETE_LISTING_ERROR: (listingId, error) => ({ listingId, error }),
  REPORT_LISTING: (listingId) => ({ listingId }),
  REPORT_LISTING_SUCCESS: () => ({ }),
  REPORT_LISTING_ERROR: (error) => ({ error }),
  IS_FAVORITE: (listingDetailId) => ({ listingDetailId }),
  ADD_TO_FAVORITES: (listingDetail) => ({ listingDetail }),
  REMOVE_FROM_FAVORITES: (listingDetailId) => ({ listingDetailId }),
  GET_FAVORITES: () => ({}),
  SEARCH_PUBLISHERS: (keywords) => ({ keywords }),
  SEARCH_PUBLISHERS_FINISH: (error, publishers) => ({ error, publishers }),
  FILTER_MY_LISTINGS: (currency, category, subCategory, searchTerm) => ({
    currency,
    category,
    subCategory,
    searchTerm
  }),
  FILTER_FAVORITES: (currency, category, subCategory, searchTerm) => ({
    currency,
    category,
    subCategory,
    searchTerm
  }),
  CLEAR_MY_LISTINGS: () => ({}),
  CHECK_PUBLISHERS_ALIVE: () => ({}),
  CHECK_PUBLISHERS_ALIVE_FINISH: (error, publishers) => ({ error, publishers }),
  GET_LISTING_TTL: () => ({}),
  GET_LISTING_TTL_DONE: (ttl) => ({ttl})
});

export {
  getListingDetail,
  getListingDetailSucceeded,
  getListingDetailFailed,
  awaitListingDetail,
  isListingFine,
  isListingFineSucceeded,
  isListingFineFailed,
  setActiveCurrency,
  setNumberToBuy,
  requestMyListings,
  requestMyListingsSuccess,
  requestMyListingsError,
  setBitcoinPrice,
  setEthereumPrice,
  setOmnicoinPrice,
  setContinuous,
  addListingImage,
  removeListingImage,
  deleteListingImage,
  startDeleteListingImage,
  deleteListingImageSuccess,
  deleteListingImageError,
  reportListing,
  reportListingSuccess,
  reportListingError,
  setListingImages,
  startUploadListingImage,
  uploadListingImage,
  uploadListingImageSuccess,
  uploadListingImageError,
  clearListingImageError,
  resetSaveListing,
  saveListing,
  saveListingSuccess,
  saveListingError,
  previewListing,
  previewListingError,
  clearPreviewListing,
  clearPreviewListingError,
  resetDeleteListing,
  deleteListing,
  deleteListingSuccess,
  deleteListingError,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  searchPublishers,
  searchPublishersFinish,
  filterMyListings,
  filterFavorites,
  clearMyListings,
  checkPublishersAlive,
  checkPublishersAliveFinish,
  getListingTtl,
  getListingTtlDone
};
