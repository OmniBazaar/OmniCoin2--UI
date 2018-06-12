import { createActions } from 'redux-actions';

const {
  getMyPurchases,
  getMyPurchasesSucceeded,
  getMyPurchasesFailed
} = createActions({
  GET_MY_PURCHASES: (from, to) => ({ from, to }),
  GET_MY_PURCHASES_SUCCEEDED: (myPurchases) => ({ myPurchases }),
  GET_MY_PURCHASES_FAILED: (error) => ({ error })
});

export {
  getMyPurchases,
  getMyPurchasesSucceeded,
  getMyPurchasesFailed
};
