import { createActions } from 'redux-actions';

const {
  setReferrer,
  setPublisher,
  setTransactionProcessor,
  setEscrow,
  changePriority,
  getRecentTransactions,
} = createActions({
  SET_REFERRER: (referrer) => ({ referrer }),
  SET_PUBLISHER: (publisher) => ({ publisher }),
  SET_TRANSACTION_PROCESSOR: (transactionProcessor) => ({ transactionProcessor }),
  SET_ESCROW: (escrow) => ({ escrow }),
  CHANGE_PRIORITY: (priority) => ({ priority }),
  GET_RECENT_TRANSACTIONS: (recentTransactions) => ({ recentTransactions }),
});

export {
  setReferrer,
  setPublisher,
  setTransactionProcessor,
  setEscrow,
  changePriority,
  getRecentTransactions,
};
