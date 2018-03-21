import { createActions } from 'redux-actions';

const {
  getFeatureList,
  getForSale,
  getCategories,
} = createActions({
  GET_FEATURE_LIST: (featureList) => ({ featureList }),
  GET_FOR_SALE: (forSaleList) => ({ forSaleList }),
  GET_CATEGORIES: (categories) => ({ categories }),
});

export { getFeatureList, getForSale, getCategories };
