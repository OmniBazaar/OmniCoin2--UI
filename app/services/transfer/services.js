const shippingAddressKey = 'shippingAddress';

export const getStoredShippingAddress = (username) => {
  const key = `${shippingAddressKey}_${username}`;
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }

  return {};
};

export const storeShippingAddress = (username, shippingAddress) => {
  const key = `${shippingAddressKey}_${username}`;
  localStorage.setItem(key, JSON.stringify(shippingAddress));
};