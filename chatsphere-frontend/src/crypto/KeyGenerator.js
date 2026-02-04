/**
 * Generate RSA key pair for secure key exchange
 * (Public key → server, Private key → stays on device)
 */
export async function generateRSAKeyPair() {
  return crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Generate AES-256-GCM session key
 * (Used to encrypt messages)
 */
export async function generateAESKey() {
  return crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );
}
