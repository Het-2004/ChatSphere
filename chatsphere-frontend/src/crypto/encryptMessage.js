export const encryptMessage = async (key, text) => {
  const encoded = new TextEncoder().encode(text);
  return crypto.subtle.encrypt({ name: "AES-GCM", iv: new Uint8Array(12) }, key, encoded);
};
