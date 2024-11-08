import { handleActions } from 'redux-actions';
import {
  loadListingDefault,
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
import { getImageFilePath } from './listingDefaultsService';

const defaultState = {
  category: '',
  subcategory: '',
  currency: '',
  price_using_btc: false,
  price_using_eth: false,
  price_using_omnicoin: false,
  description: '',
  images: {},
  address: '',
  city: '',
  post_code: '',
  country: '',
  state: '',
  name: '',
  units: '',
  bitcoin_address: '',
  ethereum_address: '',
  manual_bitcoin_address: '',
  priority_fee: '',
  phone: '',
  email: ''
};

const fixImagesData = (data) => {
  for (const imageId in data.images) {
    const imageItem = data.images[imageId];
    imageItem.localFilePath = getImageFilePath(imageItem.path);
    imageItem.id = imageId;
  }

  return data;
};

const reducer = handleActions({
  [loadListingDefault](state) {
    const data = getStoredListingDefautls();
    if (Object.keys(data).length === 0) {
      data.price_using_btc = true;
      data.price_using_eth = true;
      data.price_using_omnicoin = true;
    }
    if (!data.price_using_btc && data.currency !== 'BITCOIN') {
      delete data.bitcoin_address;
    }

    if (!data.price_using_eth && data.currency !== 'ETHEREUM') {
      delete data.ethereum_address;
    }

    if (Object.keys(data).length) {
      return {
        ...state,
        ...fixImagesData(data)
      };
    }

    return {
      ...state,
      ...defaultState
    };
  },
  [saveListingDefault](state, { payload: { listingDefault } }) {
    const data = {
      ...state,
      ...listingDefault
    };

    if (!data.price_using_btc && data.currency !== 'BITCOIN') {
      delete data.bitcoin_address;
    }
    if (!data.price_using_eth && data.currency !== 'ETHEREUM') {
      delete data.ethereum_address;
    }

    storeListingDefaults(data);
    return fixImagesData(data);
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
