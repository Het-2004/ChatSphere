import { createContext, useEffect, useMemo, useState, useCallback } from "react";
import { getToken, setToken, clearToken } from "../utils/storage";
import { loginApi, signupApi, getMeApi } from "../api/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from token
  const fetchUser = useCallback(async (jwt) => {
    try {
      const userData = await getMeApi();
      setUser(userData);
    } catch (err) {
      console.error("[Auth] Failed to fetch user:", err);
      // Token invalid, clear everything
      clearToken();
      setAuthToken(null);
      setUser(null);
    }
  }, []);

  // Initialize auth from storage on app start
  useEffect(() => {
    const stored = getToken();
    if (stored) {
      setAuthToken(stored);
      fetchUser(stored);
    }
    setLoading(false);
  }, [fetchUser]);

  /**
   * Login with email, password, and captcha token
   * Returns response with token or 2FA requirement
   */
  const login = useCallback(async (email, password, captchaToken) => {
    const response = await loginApi(email, password, captchaToken);

    // Check if 2FA is required
    if (response.requires2fa) {
      // Return the response so Login component can handle 2FA navigation
      return response;
    }

    // Normal login - store token and fetch user
    if (response.token) {
      setToken(response.token);
      setAuthToken(response.token);
      await fetchUser(response.token);
    }

    return response;
  }, [fetchUser]);

  /**
   * Signup with email, password, and captcha token
   */
  const signup = useCallback(async (email, password, captchaToken) => {
    await signupApi(email, password, captchaToken);
  }, []);

  /**
   * Complete 2FA verification and login
   */
  const complete2FA = useCallback(async (response) => {
    if (response.token) {
      setToken(response.token);
      setAuthToken(response.token);
      await fetchUser(response.token);
    }
  }, [fetchUser]);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    clearToken();
    setAuthToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      signup,
      logout,
      complete2FA,
      updateUser: setUser,
      loading
    }),
    [token, user, loading, login, signup, logout, complete2FA]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
