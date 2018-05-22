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
  removeListingImage,
  setListingImages,
  uploadListingImageSuccess,
  uploadListingImageError
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
  listingImages: {}
};

const reducer = handleActions({
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
  [removeListingImage](state, { payload: { imageId } }) {
    let listingImages = {
      ...state.listingImages
    };
    delete listingImages[imageId];
    return {
      ...state,
      listingImages: listingImages
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
        error,
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
  }
}, defaultState);

export default reducer;
