import {combineReducers} from 'redux';
import authReducer from './blockchain/auth/authReducer';
import mailReducer from './mail/mailReducer';
import connectionReducer from './blockchain/connection/connectionReducer';
import settingsReducer from './settings/settingsReducer';
import walletReducer from './wallet/walletReducer';

export default combineReducers({
    auth: authReducer,
    mail: mailReducer,
    connection: connectionReducer,
    settings: settingsReducer,
    wallet: walletReducer,
});

