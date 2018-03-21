import { handleActions } from 'redux-actions';
import { getFeatureList, getForSale, getCategories } from './marketplaceActions';

const defaultState = {
  categories: [],
  featureList: [],
  forSaleList: []
};

const reducer = handleActions({
  [getFeatureList](state, { payload: { featureList } }) {
    return {
      ...state,
      featureList
    };
  },
  [getForSale](state, { payload: { forSaleList } }) {
    return {
      ...state,
      forSaleList
    };
  },
  [getCategories](state, { payload: { categories } }) {
    return {
      ...state,
      categories
    };
  }
}, defaultState);

export default reducer;
