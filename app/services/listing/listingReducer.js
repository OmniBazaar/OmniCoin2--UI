import { handleActions } from 'redux-actions';
import _ from 'lodash';
import {
  getListingDetail,
  setActiveCurrency,
  getMyListings,
  setPaginationMyListings,
  setActivePageMyListings,
  getMyListingsByDate,
  setPaginationMyListingsByDate,
  setActivePageMyListingsByDate,
  getMyListingsLowest,
  setPaginationMyListingsLowest,
  setActivePageMyListingsLowest,
  getMyListingsHighest,
  setPaginationMyListingsHighest,
  setActivePageMyListingsHighest
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
  myListingsByDate: [],
  myListingsByDateFiltered: [],
  rowsPerPageMyListingsByDate: 3 * 6,
  activePageMyListingsByDate: 1,
  totalPagesMyListingsByDate: 1,
  myListingsLowest: [],
  myListingsLowestFiltered: [],
  rowsPerPageMyListingsLowest: 3 * 6,
  activePageMyListingsLowest: 1,
  totalPagesMyListingsLowest: 1,
  myListingsHighest: [],
  myListingsHighestFiltered: [],
  rowsPerPageMyListingsHighest: 3 * 6,
  activePageMyListingsHighest: 1,
  totalPagesMyListingsHighest: 1,
  listingDetail: {},
  activeCurrency: CoinTypes.OMNI_COIN,
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
    return {
      ...state,
      myListings,
      myListingsFiltered: myListings
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
  [getMyListingsByDate](state, { payload: { myListingsByDate } }) {
    return {
      ...state,
      myListingsByDate,
      myListingsByDateFiltered: myListingsByDate
    };
  },
  [setPaginationMyListingsByDate](state, { payload: { rowsPerPageMyListingsByDate } }) {
    const data = state.myListingsByDate;
    const { activePageMyListingsByDate } = state;
    const totalPagesMyListingsByDate = getTotalPages(data, rowsPerPageMyListingsByDate);
    const currentData = sliceData(data, activePageMyListingsByDate, rowsPerPageMyListingsByDate);

    return {
      ...state,
      totalPagesMyListingsByDate,
      rowsPerPageMyListingsByDate,
      myListingsByDateFiltered: currentData,
    };
  },
  [setActivePageMyListingsByDate](state, { payload: { activePageMyListingsByDate } }) {
    const data = state.myListingsByDate;
    if (activePageMyListingsByDate !== state.activePageMyListingsByDate) {
      const { rowsPerPageMyListingsByDate } = state;
      const currentData = sliceData(data, activePageMyListingsByDate, rowsPerPageMyListingsByDate);

      return {
        ...state,
        activePageMyListingsByDate,
        myListingsByDateFiltered: currentData,
      };
    }

    return {
      ...state,
    };
  },
  [getMyListingsLowest](state, { payload: { myListingsLowest } }) {
    const sortedData = _.sortBy(myListingsLowest, ['price']);
    return {
      ...state,
      myListingsLowest: sortedData,
      myListingsLowestFiltered: sortedData
    };
  },
  [setPaginationMyListingsLowest](state, { payload: { rowsPerPageMyListingsLowest } }) {
    const data = state.myListingsLowest;
    const { activePageMyListingsLowest } = state;
    const totalPagesMyListingsLowest = getTotalPages(data, rowsPerPageMyListingsLowest);
    const currentData = sliceData(data, activePageMyListingsLowest, rowsPerPageMyListingsLowest);

    return {
      ...state,
      totalPagesMyListingsLowest,
      rowsPerPageMyListingsLowest,
      myListingsLowestFiltered: currentData,
    };
  },
  [setActivePageMyListingsLowest](state, { payload: { activePageMyListingsLowest } }) {
    const data = _.sortBy(state.myListingsByDate, ['price']);
    if (activePageMyListingsLowest !== state.activePageMyListingsLowest) {
      const { rowsPerPageMyListingsLowest } = state;
      const currentData = sliceData(data, activePageMyListingsLowest, rowsPerPageMyListingsLowest);

      return {
        ...state,
        activePageMyListingsLowest,
        myListingsLowestFiltered: currentData,
      };
    }

    return {
      ...state,
    };
  },
  [getMyListingsHighest](state, { payload: { myListingsHighest } }) {
    const sortedData = _.sortBy(myListingsHighest, ['price']).reverse();
    return {
      ...state,
      myListingsHighest: sortedData,
      myListingsHighestFiltered: sortedData
    };
  },
  [setPaginationMyListingsHighest](state, { payload: { rowsPerPageMyListingsHighest } }) {
    const data = state.myListingsHighest;
    const { activePageMyListingsHighest } = state;
    const totalPagesMyListingsHighest = getTotalPages(data, rowsPerPageMyListingsHighest);
    const currentData = sliceData(data, activePageMyListingsHighest, rowsPerPageMyListingsHighest);

    return {
      ...state,
      totalPagesMyListingsHighest,
      rowsPerPageMyListingsHighest,
      myListingsHighestFiltered: currentData,
    };
  },
  [setActivePageMyListingsHighest](state, { payload: { activePageMyListingsHighest } }) {
    const data = _.sortBy(state.myListingsByDate, ['price']).reverse();
    if (activePageMyListingsHighest !== state.activePageMyListingsHighest) {
      const { rowsPerPageMyListingsHighest } = state;
      const currentData = sliceData(data, activePageMyListingsHighest, rowsPerPageMyListingsHighest);

      return {
        ...state,
        activePageMyListingsHighest,
        myListingsHighestFiltered: currentData,
      };
    }

    return {
      ...state,
    };
  },
}, defaultState);

export default reducer;
