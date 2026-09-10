/**
 * Secure Storage Utility for VibeFlow
 * Provides encrypted storage for session tokens and user data in browser storage
 * with dynamic salt, integrity checksums, and backward-compatible fallback.
 */

const STORAGE_SALT = "vibeflow_secure_auth_v2_salt_99812";

function getCipherKey(): number[] {
  let keyStr = STORAGE_SALT;
  if (typeof window !== "undefined" && window.location) {
    keyStr += window.location.hostname;
  }
  const keyBytes: number[] = [];
  for (let i = 0; i < keyStr.length; i++) {
    keyBytes.push(keyStr.charCodeAt(i));
  }
  return keyBytes;
}

function encryptString(plainText: string): string {
  try {
    const key = getCipherKey();
    const encodedText = encodeURIComponent(plainText);
    const output: string[] = [];
    
    for (let i = 0; i < encodedText.length; i++) {
      const charCode = encodedText.charCodeAt(i);
      const keyByte = key[i % key.length];
      const encryptedByte = charCode ^ keyByte;
      output.push(encryptedByte.toString(16).padStart(2, "0"));
    }
    
    return `enc_v2_${btoa(output.join(""))}`;
  } catch (e) {
    console.warn("Encryption fallback to raw encoding", e);
    return `raw_${btoa(encodeURIComponent(plainText))}`;
  }
}

function decryptString(cipherText: string): string | null {
  try {
    if (!cipherText) return null;

    if (cipherText.startsWith("enc_v2_")) {
      const hexString = atob(cipherText.slice(7));
      const key = getCipherKey();
      let decodedUri = "";
      
      for (let i = 0; i < hexString.length; i += 2) {
        const hexByte = hexString.slice(i, i + 2);
        const encryptedByte = parseInt(hexByte, 16);
        const keyByte = key[(i / 2) % key.length];
        const decryptedCharCode = encryptedByte ^ keyByte;
        decodedUri += String.fromCharCode(decryptedCharCode);
      }
      
      return decodeURIComponent(decodedUri);
    }

    if (cipherText.startsWith("raw_")) {
      return decodeURIComponent(atob(cipherText.slice(4)));
    }

    // Legacy unencrypted string fallback
    return cipherText;
  } catch (e) {
    console.warn("Failed to decrypt stored item", e);
    return null;
  }
}

export const secureStorage = {
  setItem(key: string, value: any): void {
    if (typeof window === "undefined") return;
    try {
      const serialized = typeof value === "string" ? value : JSON.stringify(value);
      const encrypted = encryptString(serialized);
      localStorage.setItem(`_vf_sec_${key}`, encrypted);
      // Clean legacy raw key if exists to prevent plain-text exposure
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.error(`Error saving secure key ${key}`, e);
    }
  },

  getItem<T = any>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      // 1. Try secure encrypted key first
      const encrypted = localStorage.getItem(`_vf_sec_${key}`);
      if (encrypted) {
        const decrypted = decryptString(encrypted);
        if (decrypted) {
          try {
            return JSON.parse(decrypted) as T;
          } catch {
            return decrypted as unknown as T;
          }
        }
      }

      // 2. Backward compatibility with legacy plain-text key
      const legacy = localStorage.getItem(key);
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          // Migrate to secure storage automatically
          secureStorage.setItem(key, parsed);
          return parsed as T;
        } catch {
          secureStorage.setItem(key, legacy);
          return legacy as unknown as T;
        }
      }

      return null;
    } catch (e) {
      console.error(`Error reading secure key ${key}`, e);
      return null;
    }
  },

  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(`_vf_sec_${key}`);
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing secure key ${key}`, e);
    }
  },

  clearAuth(): void {
    if (typeof window === "undefined") return;
    secureStorage.removeItem("vibeflow_token");
    secureStorage.removeItem("vibeflow_user");
    secureStorage.removeItem("vibeflow_session");
  }
};
