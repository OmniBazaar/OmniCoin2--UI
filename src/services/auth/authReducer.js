/**
 * Created by denissamohvalov on 14.02.18.
 */
import { handleActions, combineActions } from 'redux-actions';
import { login, getCurrentUser } from './authActions';

let defaultState = {
    isAuthorized: false,
    currentUser: null
};

const reducer = handleActions({
    [combineActions(login)](state, { payload: { username, password } }) {
        return { ...state,
            isAuthorized: true
        };
    },
    [combineActions(getCurrentUser)](state, {payload: {}}) {
        return {
            ...state,
            currentUser: localStorage.getItem('user')
        }
    }
}, defaultState);

export default reducer;