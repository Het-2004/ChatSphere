// Notification sounds for chat events

const sounds = {
  message: new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE="),
  notification: new Audio("data:audio/wav;base64,UklGRm4EAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUoEAAAAAAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYA=="),
  sent: new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="),
};

let soundEnabled = true;

export const playSound = (type) => {
  if (soundEnabled && sounds[type]) {
    sounds[type].currentTime = 0;
    sounds[type].play().catch(() => {
      // Ignore errors (e.g., user hasn't interacted with page yet)
    });
  }
};

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  return soundEnabled;
};

export const isSoundEnabled = () => soundEnabled;

// Browser notifications
export const requestNotificationPermission = async () => {
  if ("Notification" in window && Notification.permission === "default") {
    await Notification.requestPermission();
  }
};

export const showNotification = (title, body, icon) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: icon || "/logo.png",
      badge: "/logo.png",
      tag: "chatsphere-message",
      requireInteraction: false,
    });
    playSound("notification");
  }
};
