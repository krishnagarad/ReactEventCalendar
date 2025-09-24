import {jwtDecode} from 'jwt-decode';
const KEY = 'Auth_Token';

export const setAuthToken = (token) => {
  if (token) setWithExpiry(KEY, token.access_token, token.expires_in);
  else localStorage.removeItem(KEY);
};

const setWithExpiry = (key, value, ttl) => {
  const now = new Date();
  const item = {
    access_token: value,
    expires_in: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getAuthToken = () => {
  return getWithExpiry(KEY);
};

const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  // If the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // Compare the expiry time with the current time
  if (now.getTime() > item.expires_in) {
    // If the item has expired, remove it and return null
    localStorage.removeItem(key);
    return null;
  }
  return item.access_token;
};

export const removeAuthToken = () => {
  localStorage.removeItem(KEY);
};

export const getDecodedToken = () => {
  const token = getAuthToken();
  return token ? jwtDecode(token) : null;
};
