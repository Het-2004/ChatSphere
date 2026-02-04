/**
 * Centralized storage utilities
 * Token handling is isolated here (security best practice)
 */

const TOKEN_KEY = "chatsphere_token";

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
