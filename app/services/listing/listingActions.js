import { createActions } from 'redux-actions';

const {
  getListingDetail,
  setActiveCurrency,
} = createActions({
  GET_LISTING_DETAIL: (listingDetail) => ({ listingDetail }),
  SET_ACTIVE_CURRENCY: (activeCurrency) => ({ activeCurrency }),
});

export {
  getListingDetail,
  setActiveCurrency
};
