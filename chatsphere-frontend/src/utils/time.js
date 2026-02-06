/**
 * Format timestamp like WhatsApp
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
};

export const formatLastSeen = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  // If less than 1 min
  if (diff < 60 * 1000) return "Just now";

  // If today
  if (date.toDateString() === now.toDateString()) {
    return `at ${formatTime(timestamp)}`;
  }

  // If yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `yesterday at ${formatTime(timestamp)}`;
  }

  return `on ${date.toLocaleDateString()}`;
};
