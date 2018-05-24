const key = 'currentUser';

export const getStoredCurrentUser = () => {
	return JSON.parse(localStorage.getItem(key));
};

export const storeCurrentUser = (currentUser) => {
	localStorage.setItem(key, JSON.stringify(currentUser));
};

export const removeStoredCurrentUser = () => {
	localStorage.removeItem(key);
};
