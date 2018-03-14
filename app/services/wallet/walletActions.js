import { createActions } from 'redux-actions';

const { getBitcoinWallets, getOmniCoinWallets } = createActions({
  GET_BITCOIN_WALLETS: (bitCoinWallets) => ({ bitCoinWallets }),
  GET_OMNI_COIN_WALLETS: (omniCoinWallets) => ({ omniCoinWallets }),
});

export {
  getBitcoinWallets,
  getOmniCoinWallets,
};
