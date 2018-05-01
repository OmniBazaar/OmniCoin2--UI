import { createActions } from 'redux-actions';

const {
  transferCoin
} = createActions({
  TRANSFER_COIN: (transferInfo) => ({ transferInfo })
});

export { transferCoin };
