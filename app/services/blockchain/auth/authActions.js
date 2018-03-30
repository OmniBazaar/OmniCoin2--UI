/**
 * Created by denissamohvalov on 14.02.18.
 */
import { createActions } from 'redux-actions';

const {
  getCurrentUser,
  login,
  logout,
  signup,
  requestPcIds,
  getAccount
} = createActions({
  GET_CURRENT_USER: () => ({}),
  LOGIN: (username, password) => ({ username, password }),
  LOGOUT: () => ({}),
  SIGNUP: (username, password, referrer, macAddress, harddriveId) => (
    {
      username, password, referrer, macAddress, harddriveId
    }
  ),
  REQUEST_PC_IDS: () => ({}),
  GET_ACCOUNT: (username) => ({ username })
});


export {
  getCurrentUser,
  login,
  logout,
  signup,
  requestPcIds,
  getAccount
};
