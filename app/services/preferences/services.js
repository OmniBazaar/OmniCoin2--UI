import { getStoredCurrentUser } from '../blockchain/auth/services';

const storageKey = 'preferences';

export const getPreferences = () => {
  const user = getStoredCurrentUser();
  if (user) {
    const key = `${storageKey}_${user.username}`;
	  const data = localStorage.getItem(key);
	  if (data) {
	    return JSON.parse(data);
	  }
  }

  return {};
};

export const storePreferences = (preferences) => new Promise((resolve, reject) => {
  const user = getStoredCurrentUser();
  if (user) {
    const key = `${storageKey}_${user.username}`;
		  localStorage.setItem(key, JSON.stringify(preferences));
  }
  resolve();
});
