import { createActions } from 'redux-actions';

const {
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
} = createActions({
  GET_LISTING_DETAIL: (listingDetail) => ({ listingDetail }),
  SET_ACTIVE_CURRENCY: (activeCurrency) => ({ activeCurrency }),
  GET_MY_LISTINGS: (myListings) => ({ myListings }),
  SET_PAGINATION_MY_LISTINGS: (rowsPerPageMyListings) => ({ rowsPerPageMyListings }),
  SET_ACTIVE_PAGE_MY_LISTINGS: (activePageMyListings) => ({ activePageMyListings }),
  GET_MY_LISTINGS_BY_DATE: (myListingsByDate) => ({ myListingsByDate }),
  SET_PAGINATION_MY_LISTINGS_BY_DATE: (rowsPerPageMyListingsByDate) =>
    ({ rowsPerPageMyListingsByDate }),
  SET_ACTIVE_PAGE_MY_LISTINGS_BY_DATE: (activePageMyListingsByDate) =>
    ({ activePageMyListingsByDate }),
  GET_MY_LISTINGS_LOWEST: (myListingsLowest) => ({ myListingsLowest }),
  SET_PAGINATION_MY_LISTINGS_LOWEST: (rowsPerPageMyListingsLowest) =>
    ({ rowsPerPageMyListingsLowest }),
  SET_ACTIVE_PAGE_MY_LISTINGS_LOWEST: (activePageMyListingsLowest) =>
    ({ activePageMyListingsLowest }),
  GET_MY_LISTINGS_HIGHEST: (myListingsHighest) => ({ myListingsHighest }),
  SET_PAGINATION_MY_LISTINGS_HIGHEST: (rowsPerPageMyListingsHighest) =>
    ({ rowsPerPageMyListingsHighest }),
  SET_ACTIVE_PAGE_MY_LISTINGS_HIGHEST: (activePageMyListingsHighest) =>
    ({ activePageMyListingsHighest }),
});

export {
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
};
