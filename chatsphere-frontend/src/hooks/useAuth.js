import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Access authentication state & actions
 * Used across UI, socket, chat logic
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
