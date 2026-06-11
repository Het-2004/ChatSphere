import axios from "axios";
import { getToken, clearToken } from "../utils/storage";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
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

      // Token expired / invalid / malformed
      if (status === 401 || status === 403 || (status === 400 && error.config.url?.includes("/auth/me"))) {
        clearToken();
        window.location.reload();
      }
    }

    // Extract best possible error message from backend response
    let message = "Network error";
    if (error.response?.data) {
      const data = error.response.data;
      if (data.errors && typeof data.errors === "object") {
        // Handle field validation errors Map (e.g. ValidationErrorResponse)
        message = Object.values(data.errors).join(", ");
      } else {
        // Handle runtime exceptions and standard error formats
        message = data.error || data.message || error.message || "Network error";
      }
    } else {
      message = error.message || "Network error";
    }

    const rejectedError = new Error(message);
    rejectedError.status = error.response?.status;
    rejectedError.response = error.response;

    return Promise.reject(rejectedError);
  }
);

export default axiosClient;
