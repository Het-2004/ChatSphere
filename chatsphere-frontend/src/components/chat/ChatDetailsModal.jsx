import { useState } from "react";
import { motion } from "framer-motion";
import { addMemberApi, searchUsersApi } from "../../api/chatApi";

export default function ChatDetailsModal({ chat, onClose }) {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // If chat is null or undefined, don't render or render placeholder
    if (!chat) return null;

    const handleSearch = async (val) => {
        setQuery(val);
        if (val.length > 2) {
            try {
                const res = await searchUsersApi(val);
                setSearchResults(res);
            } catch (e) { console.error(e); }
        } else {
            setSearchResults([]);
        }
    };

    const handleAddMember = async (userId) => {
        setLoading(true);
        try {
            await addMemberApi(chat.id, userId);
            alert("Member added!");
            window.location.reload(); // Quick refresh
        } catch (err) {
            alert("Failed to add member");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    width: '400px', background: 'var(--color-bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)',
                    maxHeight: '80vh', overflowY: 'auto'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2>{chat.groupName || "Chat Details"}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                {chat.group && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3>Members</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {chat.participants && Array.from(chat.participants).map(p => (
                                <span key={p} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {chat.group && (
                    <div>
                        <h3>Add Member</h3>
                        <input
                            placeholder="Search users to add..."
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', background: 'rgba(0,0,0,0.2)', border: '1px solid #444', color: 'white' }}
                        />
                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                            {searchResults.map(user => (
                                <div
                                    key={user.id}
                                    style={{
                                        padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        background: 'rgba(255,255,255,0.05)', marginBottom: '0.25rem', borderRadius: 'var(--radius-sm)'
                                    }}
                                >
                                    <span style={{ fontSize: '0.9rem' }}>{user.name || user.email}</span>
                                    <button
                                        onClick={() => handleAddMember(user.id)}
                                        disabled={loading || chat.participants?.includes(user.id)}
                                        style={{
                                            padding: '0.25rem 0.5rem', background: 'var(--color-primary)', border: 'none',
                                            borderRadius: 'var(--radius-sm)', color: 'white', cursor: 'pointer', fontSize: '0.8rem',
                                            opacity: (loading || chat.participants?.includes(user.id)) ? 0.5 : 1
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </motion.div>
        </div>
    );
}
