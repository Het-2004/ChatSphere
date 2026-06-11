import { useState } from "react";
import { searchUsersApi, createChatApi } from "../../api/chatApi";

export default function NewChatModal({ onClose, onChatCreated }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const users = await searchUsersApi(query);
            setResults(users);
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setLoading(false);
        }
    };

    const startChat = async (userId) => {
        try {
            const chat = await createChatApi(userId);
            onChatCreated(chat);
            onClose();
        } catch (err) {
            alert("Failed to create chat");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-strong" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>New Chat</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search by email or name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                        className="search-input"
                    />
                    <button type="submit" disabled={loading} className="btn-primary search-btn">
                        {loading ? "..." : "Search"}
                    </button>
                </form>

                <div className="search-results custom-scroll">
                    {results.length === 0 && !loading && query && (
                        <p className="no-results">No users found.</p>
                    )}

                    {results.map((user) => (
                        <div key={user.id} className="search-result-item" onClick={() => startChat(user.id)}>
                            <img
                                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name || user.email}`}
                                alt={user.name}
                                className="avatar"
                            />
                            <div className="info">
                                <span className="name">{user.name || "Unknown"}</span>
                                <span className="email">{user.email}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
                    display: flex; align-items: center; justify-content: center; z-index: 2000;
                }
                .modal-content {
                    width: 90%; max-width: 450px; padding: 1.5rem; border-radius: 16px;
                    background: #1a1a2e; border: 1px solid var(--glass-border);
                }
                .modal-header {
                    display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
                }
                .modal-header h3 { margin: 0; color: var(--text-primary); }
                .close-btn { background: none; border: none; color: var(--text-secondary); font-size: 1.2rem; cursor: pointer; }
                
                .search-form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
                .search-input { flex: 1; padding: 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 8px; color: white; }
                .search-btn { padding: 0 1.2rem; }
                
                .search-results { max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; }
                .search-result-item {
                    display: flex; align-items: center; gap: 1rem; padding: 0.8rem;
                    border-radius: 8px; cursor: pointer; transition: background 0.2s;
                }
                .search-result-item:hover { background: rgba(255,255,255,0.05); }
                .avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
                .info { display: flex; flex-direction: column; }
                .name { font-weight: 500; color: var(--text-primary); }
                .email { font-size: 0.8rem; color: var(--text-secondary); }
                .no-results { text-align: center; color: var(--text-secondary); padding: 1rem; }
            `}</style>
        </div>
    );
}
