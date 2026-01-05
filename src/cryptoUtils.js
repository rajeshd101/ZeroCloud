import CryptoJS from 'crypto-js';

// In a real-world app, you'd use a more robust key exchange (like Diffie-Hellman)
// For this LAN-only tool, we'll use a shared secret for the demonstration of encryption.
const SHARED_SECRET = 'ZeroCloud-Secure-LAN-Communication-Key';

export const encryptMessage = (message) => {
  return CryptoJS.AES.encrypt(message, SHARED_SECRET).toString();
};

export const decryptMessage = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SHARED_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error('Decryption failed', e);
    return '[Encrypted Message]';
  }
};
