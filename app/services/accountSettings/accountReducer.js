import { handleActions, combineActions } from 'redux-actions';

import {
  setReferrer,
  setPublisher,
  setTransactionProcessor,
  setEscrow,
} from './accountActions';

const defaultState = {
  referrer: false,
  publisher: false,
  transactionProcessor: false,
  escrow: false,
};

const reducer = handleActions({
  [combineActions(setReferrer)](state, { payload: { referrer } }) {
    return {
      ...state,
      referrer: !state.referrer,
    };
  },
  [combineActions(setPublisher)](state, { payload: { publisher } }) {
    return {
      ...state,
      publisher: !state.publisher,
    };
  },
  [combineActions(setTransactionProcessor)](state, { payload: { transactionProcessor } }) {
    return {
      ...state,
      transactionProcessor: !state.transactionProcessor,
    };
  },
  [combineActions(setEscrow)](state, { payload: { escrow } }) {
    return {
      ...state,
      escrow: !state.escrow,
    };
  },
}, defaultState);

export default reducer;
