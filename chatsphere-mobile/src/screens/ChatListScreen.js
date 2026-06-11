import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';

const ChatListScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const {
    chats,
    activeChatId,
    setActiveChatId,
    onlineUsers,
    typingUsers,
    createChat,
    refreshChats,
  } = useContext(ChatContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Poll chats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshChats();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Search users API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await client.get(`/users/search?query=${searchQuery}`);
        // Filter out current user from search results
        setSearchResults(response.data.filter(u => u.id !== user?.id));
      } catch (e) {
        console.warn('Error searching users:', e);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleStartChat = async (targetUserId) => {
    try {
      const chat = await createChat(targetUserId);
      setSearchQuery('');
      setSearchResults([]);
      setActiveChatId(chat.id);
      navigation.navigate('ChatRoom', { chatId: chat.id });
    } catch (e) {
      console.warn('Failed to start chat:', e);
    }
  };

  const getChatName = (chat) => {
    if (chat.isGroup) return chat.name;
    const other = chat.participants?.find(p => p.id !== user?.id);
    return other?.name || other?.username || other?.email || chat.name || 'Unknown User';
  };

  const getAvatarUrl = (chat) => {
    if (chat.isGroup) {
      return chat.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=0066ff&color=fff`;
    }
    const other = chat.participants?.find(p => p.id !== user?.id);
    const displayName = other?.name || other?.username || other?.email || chat.name || 'U';
    return chat.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=00f3ff&color=0b0e14`;
  };

  const isChatOnline = (chat) => {
    if (chat.isGroup) return false;
    const other = chat.participants?.find(p => p.id !== user?.id);
    return other ? (onlineUsers.has(other.id) || other.online) : false;
  };

  const renderChatItem = ({ item }) => {
    const chatName = getChatName(item);
    const avatarUrl = getAvatarUrl(item);
    const online = isChatOnline(item);

    // Check if anyone is typing in this chat
    const chatTypers = typingUsers[item.id] || {};
    const isTyping = Object.keys(chatTypers).length > 0;

    const lastMsg = item.lastMessage;
    const lastMsgText = isTyping
      ? 'Typing...'
      : lastMsg
      ? lastMsg.text || 'Media attachment'
      : 'No messages yet';

    const lastMsgTime = lastMsg
      ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      : '';

    return (
      <TouchableOpacity
        style={styles.chatRow}
        onPress={() => {
          setActiveChatId(item.id);
          navigation.navigate('ChatRoom', { chatId: item.id });
        }}
      >
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          {online ? <View style={styles.onlineIndicator} /> : null}
        </View>

        <View style={styles.chatDetails}>
          <View style={styles.chatRowTop}>
            <Text style={styles.chatNameText} numberOfLines={1}>
              {chatName}
            </Text>
            <Text style={styles.timeText}>{lastMsgTime}</Text>
          </View>
          <Text
            style={[
              styles.lastMsgText,
              isTyping ? styles.typingText : null
            ]}
            numberOfLines={1}
          >
            {lastMsgText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSearchResultItem = ({ item }) => {
    const name = item.name || item.username || item.email || 'User';
    const avatar = item.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00f3ff&color=0b0e14`;
    const online = onlineUsers.has(item.id) || item.online;

    return (
      <TouchableOpacity
        style={styles.chatRow}
        onPress={() => handleStartChat(item.id)}
      >
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          {online ? <View style={styles.onlineIndicator} /> : null}
        </View>

        <View style={styles.chatDetails}>
          <Text style={styles.chatNameText}>{name}</Text>
          <Text style={styles.emailText}>{item.email}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Chats</Text>
          <Text style={styles.subtitle}>Welcome, {user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users to chat..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.trim() ? (
          <TouchableOpacity
            style={styles.clearSearch}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearSearchText}>✖</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Loading or Lists */}
      {searching ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00f3ff" />
        </View>
      ) : searchQuery.trim() ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={renderSearchResultItem}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No chats yet. Start searching to chat!</Text>
            </View>
          }
        />
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f29',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.2)',
  },
  logoutText: {
    color: '#ff453a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'relative',
    justifyContent: 'center',
  },
  searchInput: {
    backgroundColor: '#151a24',
    borderWidth: 1,
    borderColor: '#222d3d',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 15,
  },
  clearSearch: {
    position: 'absolute',
    right: 35,
    alignSelf: 'center',
  },
  clearSearchText: {
    color: '#8e8e93',
    fontSize: 16,
  },
  chatRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#151a24',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1c1c1e',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#30d158',
    borderWidth: 2,
    borderColor: '#0b0e14',
  },
  chatDetails: {
    flex: 1,
    marginLeft: 15,
  },
  chatRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatNameText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  timeText: {
    color: '#8e8e93',
    fontSize: 12,
  },
  lastMsgText: {
    color: '#8e8e93',
    fontSize: 14,
  },
  emailText: {
    color: '#8e8e93',
    fontSize: 12,
    marginTop: 2,
  },
  typingText: {
    color: '#00f3ff',
    fontWeight: '500',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#8e8e93',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default ChatListScreen;
