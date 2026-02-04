import { createContext, useMemo, useState } from "react";

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messagesByChat, setMessagesByChat] = useState({});
  const [typingUsers, setTypingUsers] = useState({});

  const setMessagesForChat = (chatId, messages) => {
    setMessagesByChat((prev) => ({
      ...prev,
      [chatId]: messages
    }));
  };

  const addMessage = (chatId, message) => {
    setMessagesByChat((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), message]
    }));
  };

  const value = useMemo(
    () => ({
      chats,
      setChats,
      activeChatId,
      setActiveChatId,
      messagesByChat,
      setMessagesForChat,
      addMessage,
      typingUsers,
      setTypingUsers
    }),
    [chats, activeChatId, messagesByChat, typingUsers]
  );

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
