import { useEffect } from "react";
import { useChat } from "../../hooks/useChat";
import { getChatsApi } from "../../api/chatApi";

export default function Sidebar() {
  const { chats, setChats, activeChatId, setActiveChatId } = useChat();

  useEffect(() => {
    // Load chat list on mount
    const loadChats = async () => {
      try {
        const data = await getChatsApi();
        setChats(data);
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    };

    loadChats();
  }, [setChats]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Chats</h2>
      </div>

      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${
              activeChatId === chat.id ? "active" : ""
            }`}
            onClick={() => setActiveChatId(chat.id)}
          >
            <div className="chat-avatar">
              {chat.name?.charAt(0).toUpperCase()}
            </div>

            <div className="chat-info">
              <div className="chat-name">{chat.name}</div>
              <div className="chat-last">
                {chat.lastMessage || "No messages yet"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
