import { combineReducers } from 'redux';
import authReducer from './blockchain/auth/authReducer';
import mailReducer from './mail/mailReducer';
import connectionReducer from './blockchain/connection/connectionReducer';
import settingsReducer from './settings/settingsReducer';
import walletReducer from './wallet/walletReducer';
import processorsStandbyReducer from './processors/processorsStandbyReducer';
import processorsTopReducer from './processors/processorsTopReducer';

export default combineReducers({
  auth: authReducer,
  mail: mailReducer,
  wallet: walletReducer,
  processorsStandby: processorsStandbyReducer,
  processorsTop: processorsTopReducer,
  connection: connectionReducer,
  settings: settingsReducer,
});
