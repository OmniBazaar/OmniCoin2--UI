import { createActions } from 'redux-actions';

const {
  loadListingDefault,
  saveListingDefault,
  uploadListingDefaultImage,
  uploadListingDefaultImageSuccess,
  uploadListingDefaultImageError,
  deleteListingDefaultImage,
  deleteListingDefaultImageSuccess,
  deleteListingDefaultImageError,
  clearListingDefaultImageError
} = createActions({
  LOAD_LISTING_DEFAULT: () => ({}),
  SAVE_LISTING_DEFAULT: (listingDefault) => ({ listingDefault }),
  UPLOAD_LISTING_DEFAULT_IMAGE: (file, imageId) => ({ file, imageId }),
  UPLOAD_LISTING_DEFAULT_IMAGE_SUCCESS: (imageId, path) => ({ imageId, path }),
  UPLOAD_LISTING_DEFAULT_IMAGE_ERROR: (imageId, error) => ({ imageId, error }),
  DELETE_LISTING_DEFAULT_IMAGE: (image) => ({ image }),
  DELETE_LISTING_DEFAULT_IMAGE_SUCCESS: (imageId) => ({ imageId }),
  DELETE_LISTING_DEFAULT_IMAGE_ERROR: (imageId, error) => ({ imageId, error }),
  CLEAR_LISTING_DEFAUT_IMAGE_ERROR: (imageId) => ({ imageId })
});

export {
  loadListingDefault,
  saveListingDefault,
  uploadListingDefaultImage,
  uploadListingDefaultImageSuccess,
  uploadListingDefaultImageError,
  deleteListingDefaultImage,
  deleteListingDefaultImageSuccess,
  deleteListingDefaultImageError,
  clearListingDefaultImageError
};
