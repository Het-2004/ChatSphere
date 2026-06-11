import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import { getChatsApi, createChatApi, searchUsersApi } from "../../api/chatApi";
import { formatLastSeen } from "../../utils/dateUtils";
import LoadingSpinner from "../effects/LoadingSpinner";
import EditProfileModal from "../modals/EditProfileModal";
import NewChatModal from "../modals/NewChatModal";

// SVG Icons
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const NewChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const GroupIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const itemVariants = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

const listVariants = {
  animate: { transition: { staggerChildren: 0.04 } },
};

export default function Sidebar() {
  const {
    chats,
    setChats,
    activeChatId,
    setActiveChatId,
    notifications = {},
    onlineUsers = new Set(),
  } = useChat();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [filter, setFilter] = useState("all"); // "all" | "unread"

  useEffect(() => { loadChats(); }, []);

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

  const handleSearch = useCallback(async (term) => {
    setSearchTerm(term);
    if (term.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const results = await searchUsersApi(term);
      setSearchResults(results.filter(u => u.id !== user?.id));
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  }, [user]);

  const handleChatCreated = (chat) => {
    setChats(prev => [chat, ...prev.filter(c => c.id !== chat.id)]);
    setActiveChatId(chat.id);
    setShowNewChat(false);
  };

  const startChat = async (targetUserId) => {
    try {
      const newChat = await createChatApi(targetUserId);
      handleChatCreated(newChat);
      setSearchTerm("");
      setSearchResults([]);
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  const getChatName = (chat) => {
    if (chat.isGroup) return chat.name;
    const other = chat.participants?.find(p => p.id !== user?.id);
    return other?.username || other?.name || other?.email || "Unknown";
  };

  const getChatAvatar = (chat) => {
    if (chat.isGroup) {
      return chat.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name || 'G')}&background=2a3942&color=e9edef&size=96`;
    }
    const other = chat.participants?.find(p => p.id !== user?.id);
    const name = other?.username || other?.name || other?.email || "U";
    return other?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2a3942&color=e9edef&size=96`;
  };

  const getOtherUser = (chat) => {
    if (chat.isGroup) return null;
    return chat.participants?.find(p => p.id !== user?.id);
  };

  const isUserOnline = (chat) => {
    if (chat.isGroup) return false;
    const other = getOtherUser(chat);
    if (!other) return false;
    return onlineUsers?.has?.(other.id) ?? false;
  };

  const filteredChats = filter === "unread"
    ? chats.filter(c => (notifications[c.id] || 0) > 0)
    : chats;

  const totalUnread = chats.reduce((sum, c) => sum + (notifications[c.id] || 0), 0);
  const myName = user?.name || user?.username || user?.email || "Me";
  const myAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(myName)}&background=00a884&color=fff&size=96`;

  return (
    <>
      <motion.div
        className="sidebar"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        {/* ── Header ── */}
        <div className="sidebar-header">
          <div className="sidebar-user-row" onClick={() => setShowProfileModal(true)}>
            <div className="sidebar-user-info">
              <div className="avatar-wrap">
                <img src={myAvatar} alt={myName} className="avatar" />
                <span className="online-dot" />
              </div>
              <div>
                <div className="sidebar-username">{myName}</div>
                <div className="sidebar-status">Online</div>
              </div>
            </div>
            <div className="sidebar-actions" onClick={e => e.stopPropagation()}>
              <button
                className="sidebar-icon-btn"
                onClick={() => setShowNewChat(true)}
                title="New Chat"
              >
                <NewChatIcon />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="search-container">
            <span className="search-icon"><SearchIcon /></span>
            <input
              className="search-input"
              type="text"
              placeholder="Search or start new chat"
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              autoComplete="off"
            />
            {searchTerm && (
              <button
                className="search-clear"
                onClick={() => { setSearchTerm(""); setSearchResults([]); }}
              >✕</button>
            )}
          </div>

          {/* Filter tabs */}
          {!searchTerm && (
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              {["all", "unread"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  style={{
                    padding: "4px 14px",
                    borderRadius: "999px",
                    border: "none",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    background: filter === tab ? "var(--c-primary)" : "var(--bg-elevated)",
                    color: filter === tab ? "var(--bg-app)" : "var(--text-2)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab === "all" ? "All" : `Unread${totalUnread > 0 ? ` (${totalUnread})` : ""}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Chat / Search List ── */}
        <div className="chat-list-scroll">
          {searching && (
            <div className="loading-state" style={{ padding: "16px" }}>
              <LoadingSpinner />
            </div>
          )}

          <AnimatePresence mode="wait">
            {searchResults.length > 0 ? (
              <motion.ul
                key="search"
                className="chat-list"
                variants={listVariants}
                initial="initial"
                animate="animate"
              >
                <div className="section-label">People</div>
                {searchResults.map(u => {
                  const isOnline = onlineUsers?.has?.(u.id) || u.online;
                  const name = u.name || u.username || u.email;
                  const avatar = u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2a3942&color=e9edef&size=96`;
                  return (
                    <motion.li
                      key={u.id}
                      variants={itemVariants}
                      className="chat-item"
                      onClick={() => startChat(u.id)}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="avatar-wrap">
                        <img src={avatar} alt={name} className="avatar" />
                        {isOnline && <span className="online-dot" />}
                      </div>
                      <div className="chat-meta">
                        <div className="chat-row-top">
                          <span className="chat-name">{name}</span>
                          {isOnline && (
                            <span style={{ fontSize: "0.72rem", color: "var(--online)" }}>Online</span>
                          )}
                        </div>
                        <div className="chat-row-bottom">
                          <span className="chat-preview">Tap to start chatting</span>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            ) : loading ? (
              <div className="loading-state">
                <LoadingSpinner />
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="empty-chats">
                <div className="icon">💬</div>
                <h4>{filter === "unread" ? "No unread chats" : "No chats yet"}</h4>
                <p>
                  {filter === "unread"
                    ? "You're all caught up!"
                    : "Search for people to start a conversation"}
                </p>
                {filter === "all" && (
                  <button className="start-chat-btn" onClick={() => setShowNewChat(true)}>
                    Start New Chat
                  </button>
                )}
              </div>
            ) : (
              <motion.ul
                key="chats"
                className="chat-list"
                variants={listVariants}
                initial="initial"
                animate="animate"
              >
                {filteredChats.map((chat, idx) => {
                  const isActive = activeChatId === chat.id;
                  const online = isUserOnline(chat);
                  const unread = notifications[chat.id] || 0;
                  const name = getChatName(chat);
                  const avatar = getChatAvatar(chat);
                  const preview = chat.lastMessage?.text || "No messages yet";
                  const time = chat.lastMessageAt
                    ? formatLastSeen(chat.lastMessageAt)
                    : "";

                  return (
                    <motion.li
                      key={chat.id}
                      variants={itemVariants}
                      className={`chat-item ${isActive ? "active" : ""}`}
                      onClick={() => setActiveChatId(chat.id)}
                      whileTap={{ scale: 0.99 }}
                      layout
                    >
                      <div className="avatar-wrap">
                        <img src={avatar} alt={name} className="avatar" />
                        {online && <span className="online-dot" />}
                        {chat.isGroup && (
                          <span style={{
                            position: "absolute", bottom: 0, right: 0,
                            width: 16, height: 16, background: "var(--c-primary)",
                            borderRadius: "50%", border: "2px solid var(--bg-sidebar)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.5rem", color: "var(--bg-app)",
                          }}>G</span>
                        )}
                      </div>

                      <div className="chat-meta">
                        <div className="chat-row-top">
                          <span className="chat-name">{name}</span>
                          <span className="chat-time">{time}</span>
                        </div>
                        <div className="chat-row-bottom">
                          <span className="chat-preview">{preview}</span>
                          {unread > 0 && (
                            <span className="unread-badge">{unread > 99 ? "99+" : unread}</span>
                          )}
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer ── */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <LogoutIcon />
            Logout
          </button>
        </div>
      </motion.div>

      {showProfileModal && (
        <EditProfileModal onClose={() => setShowProfileModal(false)} />
      )}
      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onChatCreated={handleChatCreated}
        />
      )}
    </>
  );
}
