import { combineReducers } from 'redux';
import authReducer from './blockchain/auth/authReducer';
import mailReducer from './mail/mailReducer';
import connectionReducer from './blockchain/connection/connectionReducer';
import settingsReducer from './settings/settingsReducer';
import walletReducer from './wallet/walletReducer';
import processorsStandbyReducer from './processors/processorsStandbyReducer';
import processorsTopReducer from './processors/processorsTopReducer';
import menuReducer from './menu/menuReducer';
import accountReducer from './accountSettings/accountReducer';
import preferencesReducer from './preferences/preferencesReducer';
import escrowReducer from './escrow/escrowReducer';
import marketplaceReducer from './marketplace/marketplaceReducer';
import lowestPriceReducer from './marketplace/lowestPriceReducer';
import highestPriceReducer from './marketplace/highestPriceReducer';
import newArrivalsReducer from './marketplace/newArrivalsReducer';
import blockchainWallet from './blockchain/wallet/walletReducer';
import listingReducer from './listing/listingReducer';
import listingDefaultsReducer from './listing/listingDefaultsReducer';

export default combineReducers({
  auth: authReducer,
  mail: mailReducer,
  wallet: walletReducer,
  blockchainWallet,
  processorsStandby: processorsStandbyReducer,
  processorsTop: processorsTopReducer,
  connection: connectionReducer,
  settings: settingsReducer,
  menu: menuReducer,
  account: accountReducer,
  preferences: preferencesReducer,
  escrow: escrowReducer,
  marketplace: marketplaceReducer,
  lowestPrice: lowestPriceReducer,
  highestPrice: highestPriceReducer,
  newArrivals: newArrivalsReducer,
  listing: listingReducer,
  listingDefaults: listingDefaultsReducer,
});
