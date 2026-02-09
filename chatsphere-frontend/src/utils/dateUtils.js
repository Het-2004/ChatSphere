/**
 * Date utility functions for formatting timestamps
 */

/**
 * Format a timestamp into a human-readable "last seen" string
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} Formatted "last seen" text
 */
export function formatLastSeen(timestamp) {
    if (!timestamp) return 'unknown';

    const now = new Date();
    const lastSeen = new Date(timestamp);
    const diffMs = now - lastSeen;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Less than 1 minute
    if (diffMinutes < 1) {
        return 'just now';
    }

    // Less than 1 hour
    if (diffMinutes < 60) {
        return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    // Less than 24 hours
    if (diffHours < 24) {
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    }

    // Yesterday
    if (diffDays === 1) {
        return 'yesterday';
    }

    // Less than 7 days
    if (diffDays < 7) {
        return `${diffDays} days ago`;
    }

    // Format as date for older timestamps
    return lastSeen.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: now.getFullYear() !== lastSeen.getFullYear() ? 'numeric' : undefined
    });
}

/**
 * Format a timestamp into a readable date and time
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} Formatted date and time
 */
export function formatDateTime(timestamp) {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * Format a timestamp into just the time
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} Formatted time
 */
export function formatTime(timestamp) {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * Check if a timestamp is today
 * @param {string|number|Date} timestamp - The timestamp to check
 * @returns {boolean} True if the timestamp is today
 */
export function isToday(timestamp) {
    if (!timestamp) return false;

    const date = new Date(timestamp);
    const today = new Date();

    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

/**
 * Check if a timestamp is yesterday
 * @param {string|number|Date} timestamp - The timestamp to check
 * @returns {boolean} True if the timestamp is yesterday
 */
export function isYesterday(timestamp) {
    if (!timestamp) return false;

    const date = new Date(timestamp);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();
}
