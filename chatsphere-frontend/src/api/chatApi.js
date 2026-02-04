import axiosClient from "./axiosClient";

/**
 * Fetch all chats for logged-in user
 */
export const getChatsApi = async () => {
  const res = await axiosClient.get("/chats");
  return res.data;
};

/**
 * Create or get 1-to-1 chat
 */
export const createChatApi = async (userId) => {
  const res = await axiosClient.post("/chats", { userId });
  return res.data;
};

/**
 * Get encrypted message history (pagination ready)
 */
export const getMessagesApi = async (chatId, page = 0, size = 30) => {
  const res = await axiosClient.get(`/messages/${chatId}`, {
    params: { page, size }
  });
  return res.data;
};
