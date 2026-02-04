/**
 * Email validation
 */
export const isEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Password policy
 * (Backend enforces again – defense in depth)
 */
export const isStrongPassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
};

/**
 * Message validation
 */
export const isValidMessage = (message) => {
  return typeof message === "string" && message.trim().length > 0;
};
