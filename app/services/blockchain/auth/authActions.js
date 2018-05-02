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
  getAccount,
  getLastLoginUserName
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
  GET_ACCOUNT: (username) => ({ username }),
  GET_LAST_LOGIN_USER_NAME: () => ({}),
});

export {
  getCurrentUser,
  login,
  logout,
  signup,
  requestPcIds,
  getAccount,
  getLastLoginUserName
};
