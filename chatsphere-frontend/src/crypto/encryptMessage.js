/**
 * Encrypt plaintext message using AES-GCM
 * A NEW random IV is generated per message (mandatory)
 */
export async function encryptMessage(aesKey, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);

  const cipherBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    aesKey,
    encoded
  );

  return {
    iv: bufferToBase64(iv),
    data: bufferToBase64(new Uint8Array(cipherBuffer))
  };
}

/* Helpers */
function bufferToBase64(buffer) {
  return btoa(String.fromCharCode(...buffer));
}
