/**
 * Created by denissamohvalov on 14.02.18.
 */
import { createActions } from 'redux-actions';


const {
    getCurrentUser,
    login
} = createActions({
    GET_CURRENT_USER: () => ({}),
    LOGIN: (username, password, callback) => ({ username, password, callback }),
});


export {
    getCurrentUser,
    login
}