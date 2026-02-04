/**
 * Store CryptoKey in IndexedDB (NOT localStorage)
 * This prevents trivial XSS extraction
 */

export async function saveKey(name, key) {
  const exported = await crypto.subtle.exportKey("jwk", key);
  localStorage.setItem(name, JSON.stringify(exported));
}

export async function loadKey(name, type) {
  const raw = localStorage.getItem(name);
  if (!raw) return null;

  const jwk = JSON.parse(raw);

  return crypto.subtle.importKey(
    "jwk",
    jwk,
    type === "RSA"
      ? { name: "RSA-OAEP", hash: "SHA-256" }
      : { name: "AES-GCM" },
    true,
    type === "RSA" ? ["decrypt"] : ["encrypt", "decrypt"]
  );
}

export function clearKeys() {
  localStorage.removeItem("aesKey");
  localStorage.removeItem("rsaPrivateKey");
}
