import { createActions } from 'redux-actions';

const { getBitcoinWallets, getEtherWallets, getOmniCoinWallets } = createActions({
  GET_BITCOIN_WALLETS: (bitCoinWallets) => ({ bitCoinWallets }),
  GET_ETHER_WALLETS: (ethereumWallets) => ({ ethereumWallets }),
  GET_OMNI_COIN_WALLETS: (omniCoinWallets) => ({ omniCoinWallets }),
});

export {
  getBitcoinWallets,
  getEtherWallets,
  getOmniCoinWallets,
};
