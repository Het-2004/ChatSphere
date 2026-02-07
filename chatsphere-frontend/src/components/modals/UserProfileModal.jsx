import { useState } from "react";
import UserStatus from "../common/UserStatus";
import Avatar from "../common/Avatar";

export default function UserProfileModal({ user, onClose }) {
  const [status, setStatus] = useState(user.status || "online");

  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="user-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="profile-header">
          <div className="profile-avatar-container">
            <Avatar name={user.name} size="large" />
            <UserStatus userId={user.id} />
          </div>
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
        </div>

        <div className="profile-info">
          <div className="info-section">
            <h3>About</h3>
            <p>{user.bio || "Hey there! I'm using ChatSphere."}</p>
          </div>

          <div className="info-section">
            <h3>Status</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="status-select"
            >
              <option value="online">🟢 Online</option>
              <option value="away">🟡 Away</option>
              <option value="busy">🔴 Busy</option>
              <option value="offline">⚫ Offline</option>
            </select>
          </div>

          <div className="info-section">
            <h3>Member Since</h3>
            <p>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-primary">Send Message</button>
          <button className="btn-secondary">Block User</button>
        </div>
      </div>
    </div>
  );
}
