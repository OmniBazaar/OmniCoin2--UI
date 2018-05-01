import { createActions } from 'redux-actions';

const {
  getListingDetail,
  setActiveCurrency,
  getMyListings,
  setPaginationMyListings,
  setActivePageMyListings,
  setBitcoinPrice,
  setOmnicoinPrice,
  setContinuous,
  addImage,
  removeImage,
  sortMyListingsBy
} = createActions({
  GET_LISTING_DETAIL: (listingDetail) => ({ listingDetail }),
  SET_ACTIVE_CURRENCY: (activeCurrency) => ({ activeCurrency }),
  GET_MY_LISTINGS: (myListings) => ({ myListings }),
  SET_PAGINATION_MY_LISTINGS: (rowsPerPageMyListings) => ({ rowsPerPageMyListings }),
  SET_ACTIVE_PAGE_MY_LISTINGS: (activePageMyListings) => ({ activePageMyListings }),
  SET_BITCOIN_PRICE: () => ({}),
  SET_OMNICOIN_PRICE: () => ({}),
  SET_CONTINUOUS: () => ({}),
  ADD_IMAGE: (image) => ({ image }),
  REMOVE_IMAGE: (imageIndex) => ({ imageIndex }),
  SORT_MY_LISTINGS_BY: (sortBy, sortDirection) => ({ sortBy, sortDirection }),
});

export {
  getListingDetail,
  setActiveCurrency,
  getMyListings,
  setPaginationMyListings,
  setActivePageMyListings,
  setBitcoinPrice,
  setOmnicoinPrice,
  setContinuous,
  addImage,
  removeImage,
  sortMyListingsBy
};
