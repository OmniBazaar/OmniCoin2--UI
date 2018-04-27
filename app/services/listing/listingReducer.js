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
  addedImages: []
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
  [addImage](state, { payload: { image } }) {
    return {
      ...state,
      addedImages: [...state.addedImages, image]
    };
  },
  [removeImage](state, { payload: { imageIndex } }) {
    return {
      ...state,
      addedImages: [
        ...state.addedImages.slice(0, imageIndex),
        ...state.addedImages.slice(imageIndex + 1)
      ],
    };
  },
}, defaultState);

export default reducer;
