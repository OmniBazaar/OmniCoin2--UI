/**
 * Created by denissamohvalov on 14.02.18.
 */
import { createActions } from 'redux-actions';


const {
    getCurrentUser,
    login,
    signup
} = createActions({
    GET_CURRENT_USER: () => ({}),
    LOGIN: (username, password, callback) => ({ username, password, callback }),
    SIGNUP: (username, password, referrer, mac_address, harddrive_id) => ({username, password, referrer, mac_address, harddrive_id})
});


export {
    getCurrentUser,
    login,
    signup
}