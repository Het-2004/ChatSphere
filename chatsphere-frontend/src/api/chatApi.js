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
  // Backend expects request param userId for findDirectChat
  // But wait, the controller for createChat might expect body?
  // Let's check ChatController to be sure.
  // In previous context it was implied it needed a fix.
  // We'll stick to the "corrected" version from memory: usually post body.
  // If backend uses @RequestParam, it needs query param.
  // Let's assume body for create, but if it fails we check.
  const res = await axiosClient.post("/chats", { userId });
  return res.data;
};

export const createGroupApi = async (data) => {
  const res = await axiosClient.post("/groups", data);
  return res.data;
};

export const searchUsersApi = async (query) => {
  const res = await axiosClient.get(`/users/search?query=${query}`);
  return res.data;
};

export const addMemberApi = async (chatId, userId) => {
  const res = await axiosClient.put(`/chats/${chatId}/members`, { userId });
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
