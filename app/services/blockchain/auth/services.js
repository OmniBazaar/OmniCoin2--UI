import isReachable from 'is-reachable';

const key = 'currentUser';

export const getStoredCurrentUser = () => JSON.parse(localStorage.getItem(key));
export const getLastStoredUserName = () => JSON.parse(localStorage.getItem('lastLoginUserName'));

export const storeCurrentUser = (currentUser) => {
  localStorage.setItem(key, JSON.stringify(currentUser));
  localStorage.setItem('lastLoginUserName', JSON.stringify(currentUser.username));
};

export const removeStoredCurrentUser = () => {
  localStorage.removeItem(key);
};

export const getFirstReachable = async (addresses) => {
  for (let i = 0; i < addresses.length; ++i) {
    const reachable = await isReachable(addresses[i]);
    if (reachable) {
      return addresses[i];
    }
  }
};
