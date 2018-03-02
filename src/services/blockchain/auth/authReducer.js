/**
 * Created by denissamohvalov on 14.02.18.
 */
import { handleActions, combineActions } from 'redux-actions';
import { signup, login, getCurrentUser } from './authActions';

let defaultState = {
    currentUser: null,
    error: null
};

const reducer = handleActions({
    [getCurrentUser](state, {payload: {}}) {
        return {
            ...state,
            currentUser: localStorage.getItem('currentUser')
        }
    },
    [login](state, {payload: {username, password, callback}}) {
      return {
          ...state,
          error: null
      }
    },
    [signup](state, {payload: {username, password, referrer, mac_address, harddrive_id}}) {
        return {
            ...state
        }
    },
    LOGIN_FAILED: (state, action) => {
        return {
            ...state,
            currentUser: null,
            error: action.error
        }
    },
    LOGIN_SUCCEEDED: (state, action) => {
        localStorage.setItem('currentUser', action.user);
        return {
            ...state,
            currentUser: action.user,
            error: null
        }
    }
}, defaultState);

export default reducer;