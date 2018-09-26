import { getStoredCurrentUser } from '../blockchain/auth/services';

const shippingAddressKey = 'shippingAddress';

export const getStoredShippingAddress = () => {
  const user = getStoredCurrentUser();
  if (user) {
    const key = `${shippingAddressKey}_${user.username}`;
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  }

  return {};
};

export const storeShippingAddress = (shippingAddress) => {
  const user = getStoredCurrentUser();
  if (user) {
    const key = `${shippingAddressKey}_${user.username}`;
    localStorage.setItem(key, JSON.stringify(shippingAddress));
  }
};