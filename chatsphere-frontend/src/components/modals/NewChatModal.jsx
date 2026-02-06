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
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>New Chat</h3>
                    <button onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search by email or name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "..." : "Search"}
                    </button>
                </form>

                <div className="search-results">
                    {results.length === 0 && !loading && query && (
                        <p className="no-results">No users found.</p>
                    )}

                    {results.map((user) => (
                        <div key={user.id} className="search-result-item" onClick={() => startChat(user.id)}>
                            <div className="avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="info">
                                <div className="name">{user.name}</div>
                                <div className="email">{user.email}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
