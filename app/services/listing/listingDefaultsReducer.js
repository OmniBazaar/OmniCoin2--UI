import { handleActions } from 'redux-actions';
import {
  getListingDefault,
  saveListingDefault,
  uploadListingDefaultImage,
  uploadListingDefaultImageSuccess,
  uploadListingDefaultImageError,
  deleteListingDefaultImage,
  deleteListingDefaultImageSuccess,
  deleteListingDefaultImageError,
  clearListingDefaultImageError
} from './listingDefaultsActions';
import {
  getStoredListingDefautls,
  storeListingDefaults
} from './listingDefaultsService';

const defaultState = {
  category: '',
  subcategory: '',
  currency: '',
  price_using_btc: false,
  price_using_omnicoin: false,
  description: '',
  images: {},
  address: '',
  city: '',
  post_code: ''
};

const reducer = handleActions({
  [getListingDefault](state) {
    const data = getStoredListingDefautls();
    if (data) {
      return {
        ...state,
        ...data
      };
    }

    return state;
  },
  [saveListingDefault](state, { payload: { listingDefault } }) {
    const data = {
      ...state,
      ...listingDefault
    };
    storeListingDefaults(data);
    return data;
  },
  [uploadListingDefaultImage](state, { payload: { file, imageId } }) {
    return {
      ...state,
      images: {
        ...state.images,
        [imageId]: {
          file,
          uploading: true,
          id: imageId
        }
      }
    };
  },
  [uploadListingDefaultImageSuccess](state, { payload: { imageId, path } }) {
    const imageItem = state.images[imageId];
    if (imageItem) {
      return {
        ...state,
        images: {
          ...state.images,
          [imageId]: {
            ...imageItem,
            uploading: false,
            file: null,
            path
          }
        }
      };
    }
    return state;
  },
  [uploadListingDefaultImageError](state, { payload: { imageId, error } }) {
    const imageItem = state.images[imageId];
    if (imageItem) {
      return {
        ...state,
        images: {
          ...state.images,
          [imageId]: {
            ...imageItem,
            uploading: false,
            file: null,
            uploadError: error
          }
        }
      };
    }
    return state;
  },
  [deleteListingDefaultImage](state, { payload: { image } }) {
    const { id } = image;
    const imageItem = state.images[id];
    if (imageItem) {
      return {
        ...state,
        images: {
          ...state.images,
          [id]: {
            ...imageItem,
            deleting: true,
            deleteError: null
          }
        }
      };
    }
    return state;
  },
  [deleteListingDefaultImageSuccess](state, { payload: { imageId } }) {
    if (state.images[imageId]) {
      const images = {
        ...state.images
      };
      delete images[imageId];
      return {
        ...state,
        images
      };
    }
    
    return state;
  },
  [deleteListingDefaultImageError](state, { payload: { imageId, error } }) {
    const imageItem = state.images[imageId];
    if (imageItem) {
      return {
        ...state,
        images: {
          ...state.images,
          [imageId]: {
            ...imageItem,
            deleting: false,
            deleteError: error
          }
        }
      };
    }
    return state;
  },
  [clearListingDefaultImageError](state, { payload: { imageId } }) {
    if (state.images[imageId]) {
      const images = {
        ...state.images
      };
      if (images[imageId].uploadError) {
        delete images[imageId];
      } else {
        images[imageId] = {
          ...images[imageId],
          deleteError: null
        };
      }

      return {
        ...state,
        images
      };
    }

    return state;
  }
}, defaultState);

export default reducer;
