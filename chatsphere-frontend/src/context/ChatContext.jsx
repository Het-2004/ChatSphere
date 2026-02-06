import { createContext, useMemo, useState } from "react";

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messagesByChat, setMessagesByChat] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [replyingTo, setReplyingTo] = useState(null); // Message object being replied to
  const [recordingUsers, setRecordingUsers] = useState({}); // { chatId: { userId: true/false } }
  const [forwardingMessage, setForwardingMessage] = useState(null); // Message object to forward

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

  const updateMessage = (chatId, messageId, updater) => {
    setMessagesByChat((prev) => {
      const chatMessages = prev[chatId] || [];
      const updatedMessages = chatMessages.map((msg) =>
        msg.id === messageId ? updater(msg) : msg
      );
      return { ...prev, [chatId]: updatedMessages };
    });
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
      updateMessage,
      typingUsers,
      setTypingUsers,
      replyingTo,
      setReplyingTo,
      recordingUsers,
      setRecordingUsers,
      forwardingMessage,
      setForwardingMessage
    }),
    [chats, activeChatId, messagesByChat, typingUsers, replyingTo, recordingUsers, forwardingMessage]
  );

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
