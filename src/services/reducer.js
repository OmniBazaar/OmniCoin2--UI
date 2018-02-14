/**
 * Created by denissamohvalov on 14.02.18.
 */
import { combineReducers } from 'redux';
import authReducer from './auth/reducer';

export default  combineReducers({
    auth: authReducer
})