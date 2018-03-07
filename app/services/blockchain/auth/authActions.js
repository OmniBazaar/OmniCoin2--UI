/**
 * Created by denissamohvalov on 14.02.18.
 */
import { createActions } from 'redux-actions';


const {
    getCurrentUser,
    login,
    signup,
    accountLookup,
    requestPcIds
} = createActions({
    GET_CURRENT_USER: () => ({}),
    LOGIN: (username, password) => ({ username, password }),
    SIGNUP: (username, password, referrer, mac_address, harddrive_id) => (
      {username, password, referrer, mac_address, harddrive_id}
      ),
    ACCOUNT_LOOKUP: (username) => ({username}),
    REQUEST_PC_IDS: () => ({})
});


export {
    getCurrentUser,
    login,
    signup,
    accountLookup,
    requestPcIds
}
