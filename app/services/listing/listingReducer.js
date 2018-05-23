import { handleActions } from 'redux-actions';
import _ from 'lodash';
import {
  getListingDetail,
  setActiveCurrency,
  getMyListings,
  setBitcoinPrice,
  setContinuous,
  setOmnicoinPrice,
  addListingImage,
  startDeleteListingImage,
  deleteListingImageSuccess,
  deleteListingImageError,
  setListingImages,
  uploadListingImageSuccess,
  uploadListingImageError,
  clearListingImageError,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  getFavorites
} from './listingActions';

const CoinTypes = Object.freeze({
  OMNI_COIN: 'OmniCoin',
});

const defaultState = {
  myListings: [],
  myListingsFiltered: [],
  listingDetail: {},
  activeCurrency: CoinTypes.OMNI_COIN,
  bitcoinPrice: false,
  omnicoinPrice: false,
  isContinuous: false,
  isFavorite: false,
  favoriteListings: [],
  listingImages: {}
};

const reducer = handleActions({
  [getFavorites](state) {
    // localStorage.removeItem('favoritesListings');
    const favorites = localStorage.getItem('favoritesListings');
    const favoriteListings = favorites ? JSON.parse(favorites) : [];
    return {
      ...state,
      favoriteListings
    };
  },
  [isFavorite](state, { payload: { listingDetailId } }) {
    const index = state.favoriteListings.length > 0 ?
      state.favoriteListings.findIndex(x => x.id === listingDetailId) : -1;
    return {
      ...state,
      isFavorite: index !== -1
    };
  },
  [addToFavorites](state, { payload: { listingDetail } }) {
    const favoriteListings = [...state.favoriteListings, listingDetail];
    localStorage.setItem('favoritesListings', JSON.stringify(favoriteListings));
    return {
      ...state,
      favoriteListings
    };
  },
  [removeFromFavorites](state, { payload: { listingDetailId } }) {
    const index = state.favoriteListings.length > 0 ?
      state.favoriteListings.findIndex(x => x.id === listingDetailId) : -1;
    const favoriteListings = [
      ...state.favoriteListings.slice(0, index),
      ...state.favoriteListings.slice(index + 1)
    ];
    localStorage.setItem('favoritesListings', favoriteListings);
    return {
      ...state,
      favoriteListings
    };
  },
  [getListingDetail](state, { payload: { listingDetail } }) {
    return {
      ...state,
      listingDetail
    };
  },
  [setActiveCurrency](state, { payload: { activeCurrency } }) {
    return {
      ...state,
      activeCurrency
    };
  },
  [getMyListings](state, { payload: { myListings } }) {
    const sortedData = _.sortBy(myListings, ['date']).reverse();
    return {
      ...state,
      myListings: sortedData,
      myListingsFiltered: sortedData
    };
  },
  [setBitcoinPrice](state) {
    return {
      ...state,
      bitcoinPrice: !state.bitcoinPrice
    };
  },
  [setOmnicoinPrice](state) {
    return {
      ...state,
      omnicoinPrice: !state.omnicoinPrice
    };
  },
  [setContinuous](state) {
    return {
      ...state,
      isContinuous: !state.isContinuous
    };
  },
  [addListingImage](state, { payload: { file, imageId } }) {
    return {
      ...state,
      listingImages: {
        ...state.listingImages,
        [imageId] : {
          file,
          uploading: true,
          id: imageId
        }
      }
    };
  },
  [setListingImages](state, { payload: { images } }) {
    return {
      ...state,
      listingImages: images ? images : {}
    }
  },
  [uploadListingImageSuccess](state, {
    payload: {
      imageId,
      image,
      thumb,
      fileName
    }
  }) {
    if (state.listingImages[imageId]) {
      let imageItem = {
        ...state.listingImages[imageId],
        uploading: false,
        image,
        thumb,
        fileName,
        file: null
      };

      return {
        ...state,
        listingImages: {
          ...state.listingImages,
          [imageId]: imageItem
        }
      };
    }

    return state;
  },
  [uploadListingImageError](state, { payload: { imageId, error } }) {
    if (state.listingImages[imageId]) {
      let imageItem = {
        ...state.listingImages[imageId],
        uploading: false,
        uploadError: error,
        file: null
      };

      return {
        ...state,
        listingImages: {
          ...state.listingImages,
          [imageId]: imageItem
        }
      };
    }

    return state;
  },
  [startDeleteListingImage](state, { payload: { imageId } }) {
    if (state.listingImages[imageId]) {
      return {
        ...state,
        listingImages: {
          ...state.listingImages,
          [imageId]: {
            ...state.listingImages[imageId],
            deleting: true,
            deleteError: null
          }
        }
      };
    }

    return state;
  },
  [deleteListingImageSuccess](state, { payload: { imageId } }) {
    let listingImages = {
      ...state.listingImages
    };
    delete listingImages[imageId];
    return {
      ...state,
      listingImages: listingImages
    };
  },
  [deleteListingImageError](state, { payload: { imageId, error } }) {
    if (state.listingImages[imageId]) {
      return {
        ...state,
        listingImages: {
          ...state.listingImages,
          [imageId]: {
            ...state.listingImages[imageId],
            deleting: false,
            deleteError: error
          }
        }
      };
    }

    return state;
  },
  [clearListingImageError](state, { payload: { imageId } }) {
    if (state.listingImages[imageId]) {
      let images = {
        ...state.listingImages
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
        listingImages: images
      };
    }

    return state;
  }
}, defaultState);

export default reducer;
