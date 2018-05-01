import { handleActions } from 'redux-actions';
import _ from 'lodash';
import {
  getListingDetail,
  setActiveCurrency,
  getMyListings,
  setPaginationMyListings,
  setActivePageMyListings,
  setBitcoinPrice,
  setContinuous,
  setOmnicoinPrice,
  addImage,
  removeImage,
  sortMyListingsBy
} from './listingActions';

const CoinTypes = Object.freeze({
  OMNI_COIN: 'OmniCoin',
});

const defaultState = {
  myListings: [],
  myListingsFiltered: [],
  activePageMyListings: 1,
  totalPagesMyListings: 1,
  rowsPerPageMyListings: 3 * 6,
  listingDetail: {},
  activeCurrency: CoinTypes.OMNI_COIN,
  bitcoinPrice: false,
  omnicoinPrice: false,
  isContinuous: false,
  addedImages: []
};

const sliceData = (data, activePage, rowsPerPage) => (
  data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
);

const getTotalPages = (data, rowsPerPage) => Math.ceil(data.length / rowsPerPage);

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
  [setPaginationMyListings](state, { payload: { rowsPerPageMyListings } }) {
    const data = state.myListings;
    const { activePageMyListings } = state;
    const totalPagesMyListings = getTotalPages(data, rowsPerPageMyListings);
    const currentData = sliceData(data, activePageMyListings, rowsPerPageMyListings);

    return {
      ...state,
      totalPagesMyListings,
      rowsPerPageMyListings,
      myListingsFiltered: currentData,
    };
  },
  [setActivePageMyListings](state, { payload: { activePageMyListings } }) {
    const data = state.myListings;
    if (activePageMyListings !== state.activePageMyListings) {
      const { rowsPerPageMyListings } = state;
      const currentData = sliceData(data, activePageMyListings, rowsPerPageMyListings);

      return {
        ...state,
        activePageMyListings,
        myListingsFiltered: currentData,
      };
    }

    return {
      ...state,
    };
  },
  [sortMyListingsBy](state, { payload: { sortBy, sortDirection } }) {
    let sortedData = _.sortBy(state.myListings, [sortBy]);
    if (sortDirection === 'descending') {
      sortedData = sortedData.reverse();
    }

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
