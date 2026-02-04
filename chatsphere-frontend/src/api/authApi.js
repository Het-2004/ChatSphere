import axiosClient from "./axiosClient";

export const loginApi = async (email, password) => {
  const res = await axiosClient.post("/auth/login", { email, password });
  return res.data;
};

export const signupApi = async (email, password) => {
  await axiosClient.post("/auth/signup", { email, password });
};
