import sjcl from 'sjcl';

/**
 * Derives a 256-bit AES key deterministically from the chatId using SHA-256
 */
function getDeterministicAESKey(chatId) {
  return sjcl.hash.sha256.hash(chatId);
}

/**
 * Encrypt message using AES-GCM (128-bit tag, 96-bit random IV)
 * Returns object matching Web Crypto API output structure: { iv: base64, data: base64 }
 */
export function encryptMessage(chatId, plaintext) {
  try {
    const keyBits = getDeterministicAESKey(chatId);
    const cipher = new sjcl.cipher.aes(keyBits);
    
    const plaintextBits = sjcl.codec.utf8String.toBits(plaintext);
    
    // Generate a random 96-bit (3 words) IV
    const ivBits = [
      Math.floor(Math.random() * 0x100000000) | 0,
      Math.floor(Math.random() * 0x100000000) | 0,
      Math.floor(Math.random() * 0x100000000) | 0
    ];
    
    // Encrypt using GCM
    const encryptedBits = sjcl.mode.gcm.encrypt(cipher, plaintextBits, ivBits, [], 128);
    
    return {
      iv: sjcl.codec.base64.fromBits(ivBits),
      data: sjcl.codec.base64.fromBits(encryptedBits)
    };
  } catch (e) {
    console.error('[Crypto] Encryption failed:', e);
    throw e;
  }
}

/**
 * Decrypt message using AES-GCM (128-bit tag, 96-bit IV)
 * Accepts payload structure matching Web Crypto API: { iv: base64, data: base64 }
 */
export function decryptMessage(chatId, payload) {
  try {
    const { iv, data } = payload;
    if (!iv || !data) {
      throw new Error('Invalid encrypted payload structure');
    }
    
    const keyBits = getDeterministicAESKey(chatId);
    const cipher = new sjcl.cipher.aes(keyBits);
    
    const ivBits = sjcl.codec.base64.toBits(iv);
    const dataBits = sjcl.codec.base64.toBits(data);
    
    const decryptedBits = sjcl.mode.gcm.decrypt(cipher, dataBits, ivBits, [], 128);
    return sjcl.codec.utf8String.fromBits(decryptedBits);
  } catch (e) {
    console.error('[Crypto] Decryption failed:', e);
    throw e;
  }
}
