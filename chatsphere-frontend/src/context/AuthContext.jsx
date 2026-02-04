import { createContext, useState } from "react";
import { getToken, setToken, clearToken } from "../utils/storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setAuthToken] = useState(getToken());

  const login = (jwt) => {
    setToken(jwt);
    setAuthToken(jwt);
  };

  const logout = () => {
    clearToken();
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
