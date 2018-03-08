import { createActions } from 'redux-actions';

const {
  setReferrer,
  setPublisher,
  setTransactionProcessor,
  setEscrow,
} = createActions({
  SET_REFERRER: (referrer) => ({ referrer }),
  SET_PUBLISHER: (publisher) => ({ publisher }),
  SET_TRANSACTION_PROCESSOR: (transactionProcessor) => ({ transactionProcessor }),
  SET_ESCROW: (escrow) => ({ escrow }),
});

export {
  setReferrer,
  setPublisher,
  setTransactionProcessor,
  setEscrow,
};
