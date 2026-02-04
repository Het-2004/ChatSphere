import axios from "axios";
import { getToken, clearToken } from "../utils/storage";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:4040/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * Attach JWT to every request (Zero-Trust)
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Global response handler
 * - Handles auth expiry
 * - Normalizes errors
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // Token expired / invalid
      if (status === 401 || status === 403) {
        clearToken();
        // Optional: redirect handled by ProtectedRoute
      }
    }

    return Promise.reject({
      status: error.response?.status,
      message:
        error.response?.data?.message ||
        error.message ||
        "Network error"
    });
  }
);

export default axiosClient;
