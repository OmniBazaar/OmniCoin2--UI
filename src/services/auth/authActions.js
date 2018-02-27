/**
 * Created by denissamohvalov on 14.02.18.
 */
import { createActions } from 'redux-actions';


const {
    getCurrentUser,
    login
} = createActions({
    GET_CURRENT_USER: () => ({}),
    LOGIN: (username, password) => ({ username, password }),
});


export {
    getCurrentUser,
    login
}