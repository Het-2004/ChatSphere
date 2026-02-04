import { createContext, useEffect, useMemo, useState } from "react";
import { getToken, setToken, clearToken } from "../utils/storage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from storage on app start
  useEffect(() => {
    const stored = getToken();
    if (stored) setAuthToken(stored);
    setLoading(false);
  }, []);

  const login = (jwt) => {
    setToken(jwt);
    setAuthToken(jwt);
  };

  const logout = () => {
    clearToken();
    setAuthToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      loading
    }),
    [token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
