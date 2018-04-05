import { createActions } from 'redux-actions';

const {
  getListingDetail,
} = createActions({
  GET_LISTING_DETAIL: (listingDetail) => ({ listingDetail }),
});

export { getListingDetail };
