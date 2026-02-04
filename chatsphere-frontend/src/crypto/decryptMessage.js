export const decryptMessage = async (key, encrypted) => {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(12) },
    key,
    encrypted
  );
  return new TextDecoder().decode(decrypted);
};
