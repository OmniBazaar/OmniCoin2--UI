import { combineReducers } from 'redux';
import authReducer from './blockchain/auth/authReducer';
import mailReducer from './mail/mailReducer';
import connectionReducer from './blockchain/connection/connectionReducer';
import walletReducer from './wallet/walletReducer';
import processorsStandbyReducer from './processors/processorsStandbyReducer';
import processorsTopReducer from './processors/processorsTopReducer';
import menuReducer from './menu/menuReducer';
import accountReducer from './accountSettings/accountReducer';
import preferencesReducer from './preferences/preferencesReducer';
import preferencesConsoleReducer from './preferencesConsole/preferencesConsoleReducer';
import escrowReducer from './escrow/escrowReducer';
import marketplaceReducer from './marketplace/marketplaceReducer';
import blockchainWallet from './blockchain/wallet/walletReducer';
import listingReducer from './listing/listingReducer';
import listingDefaultsReducer from './listing/listingDefaultsReducer';
import importReducer from './listing/importReducer';
import searchReducer from './search/searchReducer';
import bitcoinReducer from './blockchain/bitcoin/bitcoinReducer';
import EthereumReducer from './blockchain/ethereum/EthereumReducer';
import transferReducer from './transfer/transferReducer';
import dhtReducer from './search/dht/dhtReducer';
import myPurchasesReducer from './marketplace/myPurchases/myPurchasesReducer';
import configReducer from './config/configReducer';
import vestingBalancesReducer from './accountSettings/vestingBalances/vestingBalancesReducer';
import updateNotificationReducer from './updateNotification/updateNotificationReducer';
import publisherUpdateNotificationReducer from './publisherUpdateNotification/publisherUpdateNotificationReducer';
import shippingReducer from './shipping/shippingReducer';

export default combineReducers({
  auth: authReducer,
  mail: mailReducer,
  wallet: walletReducer,
  blockchainWallet,
  processorsStandby: processorsStandbyReducer,
  processorsTop: processorsTopReducer,
  connection: connectionReducer,
  menu: menuReducer,
  account: accountReducer,
  preferences: preferencesReducer,
  preferencesConsole: preferencesConsoleReducer,
  escrow: escrowReducer,
  marketplace: marketplaceReducer,
  listing: listingReducer,
  listingDefaults: listingDefaultsReducer,
  listingImport: importReducer,
  search: searchReducer,
  bitcoin: bitcoinReducer,
  ethereum: EthereumReducer,
  dht: dhtReducer,
  transfer: transferReducer,
  data: myPurchasesReducer,
  config: configReducer,
  vestingBalances: vestingBalancesReducer,
  updateNotification: updateNotificationReducer,
  publisherUpdateNotification: publisherUpdateNotificationReducer,
  shipping: shippingReducer
});
