/**
 * Created by denissamohvalov on 14.02.18.
 */
import { handleActions, combineActions } from 'redux-actions';
import { login } from './authActions';

let defaultState = {
    isAuthorized: false
};

const reducer = handleActions({
    [combineActions(login)](state, { payload: { username, password } }) {
        return { ...state,
            isAuthorized: true
        };
    }
}, defaultState);

export default reducer;