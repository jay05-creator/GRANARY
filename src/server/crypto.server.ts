/**
 * Server-only AES-256-GCM helpers for sensitive documents.
 * Key from DOCUMENT_ENCRYPTION_KEY (32-byte hex or base64) or a derived
 * fallback for preview (NOT for real production secrets).
 */
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

function getKey(): Buffer {
  const raw = process.env.DOCUMENT_ENCRYPTION_KEY?.trim();
  if (raw) {
    // Accept 64-char hex or base64
    if (/^[0-9a-fA-F]{64}$/.test(raw)) return Buffer.from(raw, "hex");
    try {
      const b = Buffer.from(raw, "base64");
      if (b.length === 32) return b;
    } catch {
      /* fall through */
    }
    // Derive from passphrase
    return scryptSync(raw, "granary-doc-salt", 32);
  }
  // Preview-only fallback — rotate on process restart
  const g = globalThis as typeof globalThis & { __docKey__?: Buffer };
  g.__docKey__ ??= randomBytes(32);
  return g.__docKey__;
}

/** Encrypt plaintext buffer → base64(iv || tag || ciphertext) */
export function encryptDocument(plain: Buffer): string {
  const key = getKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

/** Decrypt base64(iv || tag || ciphertext) → Buffer */
export function decryptDocument(ciphertextB64: string): Buffer {
  const key = getKey();
  const buf = Buffer.from(ciphertextB64, "base64");
  if (buf.length < IV_LEN + TAG_LEN + 1) throw new Error("Invalid ciphertext");
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const data = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]);
}
