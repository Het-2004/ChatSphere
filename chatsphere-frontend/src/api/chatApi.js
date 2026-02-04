import axiosClient from "./axiosClient";

export const getMessages = async (chatId) => {
  const res = await axiosClient.get(`/messages/${chatId}`);
  return res.data;
};
