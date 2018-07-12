import { createActions } from 'redux-actions';

const { getBitcoinWallets, getEthereumWallets, getOmniCoinWallets } = createActions({
  GET_BITCOIN_WALLETS: (bitCoinWallets) => ({ bitCoinWallets }),
  GET_ETHEREUM_WALLETS: (ethereumWallets) => ({ ethereumWallets }),
  GET_OMNI_COIN_WALLETS: (omniCoinWallets) => ({ omniCoinWallets }),
});

export {
  getBitcoinWallets,
  getEthereumWallets,
  getOmniCoinWallets,
};
