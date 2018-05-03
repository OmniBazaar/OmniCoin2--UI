import { createActions } from 'redux-actions';

const {
  submitTransfer
} = createActions({
  SUBMIT_TRANSFER: () => ({})
});

export { submitTransfer };
