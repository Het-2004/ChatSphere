import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import client from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';
import { connectSocket, disconnectSocket, sendEvent } from '../websocket/socket';
import { encryptMessage, decryptMessage } from '../crypto/encryption';

export const ChatContext = createContext({});

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messagesByChat, setMessagesByChat] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState({});
  const [socketConnected, setSocketConnected] = useState(false);

  // Load chats on login
  useEffect(() => {
    if (!user) {
      setChats([]);
      setActiveChatId(null);
      setMessagesByChat({});
      disconnectSocket();
      return;
    }

    loadChats();
  }, [user]);

  // Connect WebSocket
  useEffect(() => {
    if (!user) return;

    const setupSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        connectSocket(
          token,
          handleSocketMessage,
          () => setSocketConnected(true),
          () => setSocketConnected(false)
        );
      } catch (e) {
        console.warn('Socket setup error:', e);
      }
    };

    setupSocket();

    return () => {
      disconnectSocket();
    };
  }, [user]);

  const loadChats = async () => {
    try {
      const response = await client.get('/chats');
      setChats(response.data);
    } catch (e) {
      console.warn('Error loading chats:', e);
    }
  };

  // Sync onlineUsers list with initial loaded chats online status
  useEffect(() => {
    if (!chats || chats.length === 0) return;
    const initialOnline = new Set();
    chats.forEach(chat => {
      chat.participants?.forEach(p => {
        if (p.online) {
          initialOnline.add(p.id);
        }
      });
    });
    setOnlineUsers(prev => {
      const merged = new Set(prev);
      initialOnline.forEach(id => merged.add(id));
      return merged;
    });
  }, [chats]);

  const loadMessages = useCallback(async (chatId) => {
    if (messagesByChat[chatId]) return; // Already loaded

    try {
      const response = await client.get(`/messages/${chatId}`);
      // Decrypt historical messages
      const decrypted = response.data.map(msg => {
        try {
          if (msg.encryptedPayload) {
            const payload = JSON.parse(msg.encryptedPayload);
            const decryptedText = decryptMessage(chatId, payload);
            return { ...msg, text: decryptedText };
          }
        } catch (err) {
          console.warn('Failed to decrypt historical message:', err);
          return { ...msg, text: '[Decryption failed]', error: true };
        }
        return msg;
      });

      setMessagesByChat(prev => ({
        ...prev,
        [chatId]: decrypted
      }));
    } catch (e) {
      console.warn('Error loading messages:', e);
    }
  }, [messagesByChat]);

  // Handle incoming websocket messages
  const handleSocketMessage = (msg) => {
    const { type, payload } = msg;

    switch (type) {
      case 'RECEIVE_MESSAGE':
        const incomingMsg = payload;
        const msgChatId = incomingMsg.chatId;
        
        let decryptedMsg = { ...incomingMsg };
        try {
          if (incomingMsg.encryptedPayload) {
            const payloadObj = JSON.parse(incomingMsg.encryptedPayload);
            decryptedMsg.text = decryptMessage(msgChatId, payloadObj);
          }
        } catch (err) {
          console.warn('Failed to decrypt incoming message:', err);
          decryptedMsg.text = '[Decryption failed]';
          decryptedMsg.error = true;
        }

        setMessagesByChat(prev => {
          const chatMsgs = prev[msgChatId] || [];
          if (chatMsgs.some(m => m.id === decryptedMsg.id)) {
            return prev;
          }
          return {
            ...prev,
            [msgChatId]: [...chatMsgs, decryptedMsg]
          };
        });

        // Update last message in chat list
        setChats(prev => prev.map(c => {
          if (c.id === msgChatId) {
            return { ...c, lastMessage: decryptedMsg, lastMessageAt: decryptedMsg.timestamp };
          }
          return c;
        }));
        break;

      case 'USER_ONLINE':
        setOnlineUsers(prev => {
          const updated = new Set(prev);
          updated.add(payload.userId);
          return updated;
        });
        break;

      case 'USER_OFFLINE':
        setOnlineUsers(prev => {
          const updated = new Set(prev);
          updated.delete(payload.userId);
          return updated;
        });
        break;

      case 'TYPING_START':
        setTypingUsers(prev => ({
          ...prev,
          [payload.chatId]: { ...prev[payload.chatId], [payload.userId]: true }
        }));
        break;

      case 'TYPING_STOP':
        setTypingUsers(prev => {
          const chatTyping = { ...prev[payload.chatId] };
          delete chatTyping[payload.userId];
          return {
            ...prev,
            [payload.chatId]: chatTyping
          };
        });
        break;

      default:
        break;
    }
  };

  const createChat = useCallback(async (userId) => {
    try {
      const response = await client.post('/chats', { userId });
      await loadChats();
      return response.data;
    } catch (e) {
      console.warn('Error creating chat:', e);
      throw e;
    }
  }, []);

  const createGroup = useCallback(async (name, memberIds) => {
    try {
      const response = await client.post('/groups', { name, memberIds });
      await loadChats();
      return response.data;
    } catch (e) {
      console.warn('Error creating group:', e);
      throw e;
    }
  }, []);

  const sendMessage = useCallback((chatId, text) => {
    // Optimistically add message
    const tempId = `temp-${Date.now()}`;
    const pendingMsg = {
      id: tempId,
      senderId: user?.id,
      text,
      timestamp: new Date().toISOString(),
      pending: true
    };

    setMessagesByChat(prev => {
      const chatMsgs = prev[chatId] || [];
      return {
        ...prev,
        [chatId]: [...chatMsgs, pendingMsg]
      };
    });

    try {
      const encryptedPayload = encryptMessage(chatId, text);
      sendEvent('SEND_MESSAGE', {
        chatId,
        payload: encryptedPayload,
        type: 'TEXT'
      });
    } catch (e) {
      console.warn('Failed to encrypt/send message:', e);
    }
  }, [user]);

  return (
    <ChatContext.Provider value={{
      chats,
      activeChatId,
      setActiveChatId,
      messages: messagesByChat[activeChatId] || [],
      onlineUsers,
      typingUsers,
      socketConnected,
      loadMessages,
      sendMessage,
      createChat,
      createGroup,
      refreshChats: loadChats
    }}>
      {children}
    </ChatContext.Provider>
  );
};
