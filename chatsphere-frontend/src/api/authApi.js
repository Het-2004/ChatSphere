import axiosClient from "./axiosClient";

/**
 * Login user
 * @returns AuthResponse object with token, requires2fa, userId
 */
export const loginApi = async (email, password, captchaToken) => {
  const res = await axiosClient.post("/auth/login", {
    email,
    password,
    captchaToken
  });
  return res.data; // Return full AuthResponse object
};

export const verify2fa = async (userId, code) => {
  const response = await axiosClient.post("/auth/verify-2fa", { userId, code });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axiosClient.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await axiosClient.post("/auth/reset-password", { token, newPassword });
  return response.data;
};

/**
 * Signup user
 */
export const signupApi = async (email, password, captchaToken) => {
  await axiosClient.post("/auth/signup", {
    email,
    password,
    captchaToken
  });
};

/**
 * Get current authenticated user
 * (Used for profile, socket auth, presence)
 */
export const getMeApi = async () => {
  const res = await axiosClient.get("/auth/me");
  return res.data;
};
