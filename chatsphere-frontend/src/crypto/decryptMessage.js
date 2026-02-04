/**
 * Decrypt AES-GCM encrypted message
 */
export async function decryptMessage(aesKey, payload) {
  const iv = base64ToBuffer(payload.iv);
  const data = base64ToBuffer(payload.data);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv
    },
    aesKey,
    data
  );

  return new TextDecoder().decode(decrypted);
}

/* Helpers */
function base64ToBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
