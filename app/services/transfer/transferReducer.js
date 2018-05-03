import { handleActions } from 'redux-actions';

import { submitTransfer } from './transferActions';

const defaultState = {
  fromName: '',
  toName: '',
  fromAccount: null,
  toAccount: null,
  orig_account: null,
  amount: '',
  asset_id: null,
  asset: null,
  memo: '',
  error: null,
  propose: false,
  propose_account: '',
  feeAsset: null,
  fee_asset_id: '1.3.0',
  feeAmount: 0,
  feeStatus: {},
  maxAmount: false,
  hidden: false,
  reputation: "5"
};

const reducer = handleActions({
  [submitTransfer](state, { payload: { } }) {
    return {
      ...state,
      error: null
    };
  },
  SUBMIT_TRANSFER_SUCCEEDED: (state, action) => ({
    ...state,
    error: null
  }),
  UPDATE_TRANSFER_FAILED: (state, { error }) => ({
    ...state,
    error
  }),
}, defaultState);

export default reducer;
