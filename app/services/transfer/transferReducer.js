import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  transferCoin
} from './transferActions';

const defaultState = {
  from_name: '',
  to_name: '',
  from_account: null,
  to_account: null,
  orig_account: null,
  amount: '',
  asset_id: null,
  asset: null,
  memo: '',
  error: null,
  escrow: false,
  fee_asset_id: '1.3.0',
  feeAmount: 9,
  feeStatus: {},
  maxAmount: false
};

const reducer = handleActions({
  TRANSFER_COIN_SUCCEEDED: (state, {result}) => ({
    ..state,
    error: null
  }),
TRANSFER_COIN_FAILED: (state, {error}) => ({
    ..state,
    error
  })
}, defaultState);

export default reducer;
