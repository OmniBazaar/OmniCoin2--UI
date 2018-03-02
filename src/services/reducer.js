/**
 * Created by denissamohvalov on 14.02.18.
 */
import { combineReducers } from 'redux';
import authReducer from './auth/authReducer';
import mailReducer from './mail/mailReducer';
import walletReducer from './wallet/walletReducer';
import processorsStandbyReducer from './processors/processorsStandbyReducer';
import processorsTopReducer from './processors/processorsTopReducer';

export default combineReducers({
  auth: authReducer,
  mail: mailReducer,
  wallet: walletReducer,
  processorsStandby: processorsStandbyReducer,
  processorsTop: processorsTopReducer,
});
