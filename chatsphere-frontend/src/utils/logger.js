const isDev = import.meta.env.DEV;

/**
 * Central logger
 * Prevents sensitive data leaking in production
 */
export const logger = {
  info: (...args) => {
    if (isDev) console.info("[INFO]", ...args);
  },
  warn: (...args) => {
    if (isDev) console.warn("[WARN]", ...args);
  },
  error: (...args) => {
    console.error("[ERROR]", ...args);
  }
};
