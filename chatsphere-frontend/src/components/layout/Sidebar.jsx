import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import { getChatsApi, createChatApi, searchUsersApi } from "../../api/chatApi";
import { formatLastSeen } from "../../utils/dateUtils";
import LoadingSpinner from "../effects/LoadingSpinner";
import { containerVariants, itemVariants } from "../animations/variants";

export default function Sidebar() {
  const {
    chats,
    setChats,
    activeChatId,
    setActiveChatId,
    notifications,
    onlineUsers
  } = useChat();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const data = await getChatsApi();
      setChats(data);
    } catch (err) {
      console.error("Failed to load chats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      // Debounce could be added here
      const results = await searchUsersApi(term);
      setSearchResults(results.filter(u => u.id !== user.id));
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const startChat = async (targetUserId) => {
    try {
      const newChat = await createChatApi(targetUserId);
      setChats([newChat, ...chats.filter(c => c.id !== newChat.id)]);
      setActiveChatId(newChat.id);
      setShowNewChat(false);
      setSearchTerm("");
      setSearchResults([]);
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  const getChatName = (chat) => {
    if (!chat.isGroup) {
      const other = chat.participants.find(p => p.id !== user.id);
      return other?.username || "Unknown User";
    }
    return chat.name;
  };

  const getChatAvatar = (chat) => {
    if (!chat.isGroup) {
      const other = chat.participants.find(p => p.id !== user.id);
      return other?.avatarUrl || "https://ui-avatars.com/api/?name=" + (other?.username || "U");
    }
    return chat.avatarUrl || "https://ui-avatars.com/api/?name=" + chat.name;
  };

  const getOnlineStatus = (chat) => {
    if (chat.isGroup) return null;
    const other = chat.participants.find(p => p.id !== user.id);
    if (!other) return null;
    return onlineUsers.has(other.id);
  };

  return (
    <motion.div
      className="sidebar glass-strong"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <header className="sidebar-header">
        <div className="user-profile">
          <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username}`} alt="Profile" className="avatar" />
          <div className="user-info">
            <h3>{user?.username}</h3>
            <span className="status-indicator online">Online</span>
          </div>
          <button onClick={logout} className="btn-icon" title="Logout">
            🚪
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => { setSearchTerm(""); setSearchResults([]); }} className="clear-search">
              ✕
            </button>
          )}
        </div>
      </header>

      <div className="chat-list-container">
        {loading ? (
          <div className="loading-state">
            <LoadingSpinner />
          </div>
        ) : (
          <motion.ul
            className="chat-list"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="search-results">
                <h4>Found Users</h4>
                {searchResults.map(u => (
                  <motion.li
                    key={u.id}
                    variants={itemVariants}
                    onClick={() => startChat(u.id)}
                    className="chat-item search-result"
                  >
                    <img src={u.avatarUrl || `https://ui-avatars.com/api/?name=${u.username}`} alt={u.username} className="avatar" />
                    <div className="chat-info">
                      <span className="chat-name">{u.username}</span>
                      <span className="chat-preview">Click to start chatting</span>
                    </div>
                  </motion.li>
                ))}
              </div>
            )}

            {/* Existing Chats */}
            {chats.length === 0 && searchResults.length === 0 ? (
              <div className="empty-state">
                <p>No chats yet. Start a conversation!</p>
                <button onClick={() => setShowNewChat(true)} className="btn-primary">
                  Start New Chat
                </button>
              </div>
            ) : (
              chats.map(chat => {
                const isActive = activeChatId === chat.id;
                const isOnline = getOnlineStatus(chat);
                const unread = notifications[chat.id] || 0;

                return (
                  <motion.li
                    key={chat.id}
                    variants={itemVariants}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`chat-item ${isActive ? 'active' : ''}`}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="avatar-wrapper">
                      <img src={getChatAvatar(chat)} alt="Avatar" className="avatar" />
                      {isOnline && <span className="online-badge" />}
                    </div>

                    <div className="chat-info">
                      <div className="chat-header">
                        <span className="chat-name">{getChatName(chat)}</span>
                        {chat.lastMessageAt && (
                          <span className="chat-time">{formatLastSeen(chat.lastMessageAt)}</span>
                        )}
                      </div>
                      <div className="chat-footer">
                        <span className="chat-preview text-truncate">
                          {chat.lastMessage?.text || "No messages yet"}
                        </span>
                        {unread > 0 && <span className="unread-badge">{unread}</span>}
                      </div>
                    </div>
                  </motion.li>
                );
              })
            )}
          </motion.ul>
        )}
      </div>

      <style>{`
        .sidebar {
          width: 350px;
          height: 100%;
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          background: rgba(10, 10, 15, 0.6); 
          /* fallback if glass-strong doesn't apply well */
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--glass-border);
          background: rgba(0,0,0,0.2);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .user-info h3 {
          margin: 0;
          font-size: 1.1rem;
          color: var(--text-primary);
        }

        .status-indicator {
          font-size: 0.8rem;
          color: var(--color-success);
        }

        .search-bar {
          position: relative;
        }

        .search-bar input {
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          background: rgba(255,255,255,0.05);
          color: white;
          transition: all 0.3s ease;
        }

        .search-bar input:focus {
          background: rgba(255,255,255,0.1);
          border-color: var(--color-primary);
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
        }

        .chat-list-container {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }
        
        .chat-list-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .chat-list-container::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }

        .chat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s;
          margin-bottom: 0.5rem;
        }

        .chat-item.active {
          background: rgba(0, 243, 255, 0.1);
          border: 1px solid rgba(0, 243, 255, 0.2);
        }

        .avatar-wrapper {
          position: relative;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255,255,255,0.1);
        }

        .online-badge {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: var(--color-success);
          border-radius: 50%;
          border: 2px solid var(--bg-primary);
          box-shadow: 0 0 5px var(--color-success);
        }

        .chat-info {
          flex: 1;
          min-width: 0;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .chat-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .chat-time {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .chat-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-preview {
          font-size: 0.9rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .unread-badge {
          background: var(--color-primary);
          color: black;
          font-size: 0.75rem;
          font-weight: bold;
          padding: 0.1rem 0.4rem;
          border-radius: 10px;
          box-shadow: 0 0 10px var(--color-primary);
        }
        
        .empty-state {
          text-align: center;
          padding: 2rem;
          color: var(--text-secondary);
        }
      `}</style>
    </motion.div>
  );
}
