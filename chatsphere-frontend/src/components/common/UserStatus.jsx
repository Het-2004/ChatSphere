import { useEffect, useState } from "react";

export default function UserStatus({ userId }) {
  const [status, setStatus] = useState("offline"); // online, offline, away, busy

  useEffect(() => {
    // TODO: Connect to presence service via WebSocket
    // For now, randomly set status for demo
    const statuses = ["online", "offline", "away", "busy"];
    setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
  }, [userId]);

  const statusColors = {
    online: "#00ff00",
    offline: "#888888",
    away: "#ffaa00",
    busy: "#ff0000",
  };

  return (
    <span
      className="user-status-indicator"
      style={{ backgroundColor: statusColors[status] }}
      title={status}
    />
  );
}
