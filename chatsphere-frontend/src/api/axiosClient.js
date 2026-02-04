import axios from "axios";
import { getToken } from "../utils/storage";

const axiosClient = axios.create({
  baseURL: "http://localhost:4040/api",
});

axiosClient.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
