import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { searchUsersApi, createGroupApi } from "../../api/chatApi";
import { useChat } from "../../hooks/useChat";

export default function GroupCreateModal({ onClose }) {
    const [groupName, setGroupName] = useState("");
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { fetchChats } = useChat();

    useEffect(() => {
        if (!query) {
            setSearchResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const results = await searchUsersApi(query);
                setSearchResults(results);
            } catch (err) {
                console.error(err);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (user) => {
        if (!selectedUsers.find(u => u.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
        setQuery("");
        setSearchResults([]);
    };

    const handleRemove = (userId) => {
        setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
    };

    const handleCreate = async () => {
        if (!groupName || selectedUsers.length === 0) return;
        setLoading(true);
        try {
            await createGroupApi({
                name: groupName,
                participantIds: selectedUsers.map(u => u.id),
                avatarUrl: null
            });
            fetchChats();
            onClose();
        } catch (err) {
            alert("Failed to create group");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                width: '400px', background: 'var(--color-bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)'
            }}>
                <h2>Create Group</h2>

                <input
                    placeholder="Group Name"
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                />

                <div style={{ marginBottom: '1rem' }}>
                    <input
                        placeholder="Search users..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                    />
                    {searchResults.length > 0 && (
                        <div style={{ maxHeight: '100px', overflowY: 'auto', background: '#333' }}>
                            {searchResults.map(user => (
                                <div
                                    key={user.id}
                                    onClick={() => handleSelect(user)}
                                    style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #444' }}
                                >
                                    {user.name || user.email}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {selectedUsers.map(u => (
                        <span key={u.id} style={{ background: 'var(--color-primary)', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.8rem' }}>
                            {u.name || u.email} <span onClick={() => handleRemove(u.id)} style={{ cursor: 'pointer', marginLeft: '0.5rem' }}>×</span>
                        </span>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #666', color: 'white' }}>Cancel</button>
                    <button onClick={handleCreate} disabled={loading || !groupName || selectedUsers.length === 0} style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', border: 'none', color: 'white' }}>Create</button>
                </div>
            </div>
        </div>
    );
}
