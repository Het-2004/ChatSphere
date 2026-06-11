import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import MessageBubble from '../components/MessageBubble';
import { sendEvent } from '../websocket/socket';

const ChatRoomScreen = ({ route, navigation }) => {
  const { chatId } = route.params;
  const { user } = useContext(AuthContext);
  const {
    chats,
    activeChatId,
    setActiveChatId,
    messages,
    loadMessages,
    sendMessage,
    onlineUsers,
    typingUsers,
  } = useContext(ChatContext);

  const [text, setText] = useState('');
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const activeChat = chats.find((c) => c.id === chatId);

  useEffect(() => {
    setActiveChatId(chatId);
    loadMessages(chatId);

    // Clean up active chat on exit
    return () => {
      setActiveChatId(null);
      // Send typing stop on exit if typing
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        sendEvent('TYPING_STOP', { chatId });
      }
    };
  }, [chatId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;

    // Send message via ChatContext (this optimistically updates local state & sends over socket)
    sendMessage(chatId, text.trim());
    setText('');

    // Stop typing immediately
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      sendEvent('TYPING_STOP', { chatId });
    }
  };

  const handleTextChange = (val) => {
    setText(val);

    if (!val.trim()) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        sendEvent('TYPING_STOP', { chatId });
      }
      return;
    }

    // Trigger TYPING_START
    sendEvent('TYPING_START', { chatId });

    // Debounce TYPING_STOP
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendEvent('TYPING_STOP', { chatId });
    }, 2000);
  };

  // Chat Metadata helpers
  const getChatName = () => {
    if (!activeChat) return 'Chat';
    if (activeChat.isGroup) return activeChat.name;
    const other = activeChat.participants?.find((p) => p.id !== user?.id);
    return other?.name || other?.username || other?.email || activeChat.name || 'Chat';
  };

  const getAvatarUrl = () => {
    if (!activeChat) return 'https://ui-avatars.com/api/?name=Chat';
    if (activeChat.isGroup) {
      return activeChat.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeChat.name)}&background=0066ff&color=fff`;
    }
    const other = activeChat.participants?.find((p) => p.id !== user?.id);
    const displayName = other?.name || other?.username || other?.email || activeChat.name || 'U';
    return activeChat.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=00f3ff&color=0b0e14`;
  };

  const isChatOnline = () => {
    if (!activeChat || activeChat.isGroup) return false;
    const other = activeChat.participants?.find((p) => p.id !== user?.id);
    return other ? (onlineUsers.has(other.id) || other.online) : false;
  };

  const renderStatus = () => {
    if (!activeChat) return null;

    // Check typing status
    const chatTypers = typingUsers[chatId] || {};
    const isTyping = Object.keys(chatTypers).length > 0;

    if (isTyping) {
      return <Text style={styles.statusTyping}>Typing...</Text>;
    }

    const online = isChatOnline();
    return (
      <Text style={[styles.statusText, online ? styles.statusOnline : null]}>
        {online ? 'Online' : 'Offline'}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>⬅</Text>
        </TouchableOpacity>

        <Image source={{ uri: getAvatarUrl() }} style={styles.avatar} />

        <View style={styles.headerInfo}>
          <Text style={styles.titleText} numberOfLines={1}>
            {getChatName()}
          </Text>
          {renderStatus()}
        </View>
      </View>

      {/* Message List */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble message={item} own={item.senderId === user?.id} />
          )}
          contentContainerStyle={styles.listContent}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#666"
            value={text}
            onChangeText={handleTextChange}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0e14',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f29',
    backgroundColor: '#0f131a',
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  backText: {
    color: '#00f3ff',
    fontSize: 22,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1c1c1e',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  titleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#8e8e93',
    fontSize: 12,
    marginTop: 2,
  },
  statusOnline: {
    color: '#30d158',
  },
  statusTyping: {
    color: '#00f3ff',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  listContent: {
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0f131a',
    borderTopWidth: 1,
    borderTopColor: '#1a1f29',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#151a24',
    borderWidth: 1,
    borderColor: '#222d3d',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    color: '#fff',
    fontSize: 15,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#0066ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0066ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ChatRoomScreen;
