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
  addedImages: [],
  favoriteListings: []
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
