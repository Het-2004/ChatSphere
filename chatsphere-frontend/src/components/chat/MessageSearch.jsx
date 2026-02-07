import { useState } from "react";

export default function MessageSearch({ messages, onMessageSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const filtered = messages.filter((msg) =>
      msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <>
      <button
        className="search-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Search messages"
      >
        🔍
      </button>

      {isOpen && (
        <div className="message-search-panel">
          <div className="search-header">
            <input
              type="text"
              placeholder="Search in conversation..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="search-results">
            {results.length === 0 && query && (
              <div className="no-results">No messages found</div>
            )}

            {results.map((msg) => (
              <div
                key={msg.id}
                className="search-result-item"
                onClick={() => {
                  onMessageSelect(msg);
                  setIsOpen(false);
                }}
              >
                <div className="result-text">{msg.text}</div>
                <div className="result-time">
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
