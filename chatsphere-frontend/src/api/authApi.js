import axiosClient from "./axiosClient";

/**
 * Login user
 * @returns JWT token (string)
 */
export const loginApi = async (email, password) => {
  const res = await axiosClient.post("/auth/login", {
    email,
    password
  });
  return res.data?.token; // token string
};

/**
 * Signup user
 */
export const signupApi = async (email, password) => {
  await axiosClient.post("/auth/signup", {
    email,
    password
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
