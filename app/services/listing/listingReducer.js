import { handleActions } from 'redux-actions';
import _ from 'lodash';
import {
  getListingDetail,
  setActiveCurrency,
  getMyListings,
  setBitcoinPrice,
  setContinuous,
  setOmnicoinPrice,
  addImage,
  removeImage,
  setImages
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
  listingImages: []
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
  [addImage](state, { payload: { file } }) {
    return {
      ...state,
      listingImages: [
        ...state.listingImages,
        {
          file,
          uploading: true
        }
      ]
    };
  },
  [removeImage](state, { payload: { imageIndex } }) {
    return {
      ...state,
      listingImages: state.listingImages.filter((img, index)=>{
        return index !== imageIndex;
      })
    };
  },
  [setImages](state, { payload: { images } }) {
    return {
      ...state,
      listingImages: images ? images : []
    }
  }
}, defaultState);

export default reducer;
