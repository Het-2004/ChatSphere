/**
 * Centralized storage utilities
 * Token handling is isolated here (security best practice)
 */

const TOKEN_KEY = "chatsphere_token";

export const setToken = (token) => {
  const value = token && typeof token === "object" ? token.token : token;
  localStorage.setItem(TOKEN_KEY, value || "");
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
