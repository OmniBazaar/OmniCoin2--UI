/**
 * Created by denissamohvalov on 14.02.18.
 */
import { combineReducers } from 'redux';
import authReducer from './auth/authReducer';
import mailReducer from './mail/mailReducer';

export default combineReducers({
  auth: authReducer,
  mail: mailReducer,
});
