import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || process.env.N8N_WEBHOOK_SECRET || 'akshayam-secure-secret-token-2026';

/**
 * Modern secure PBKDF2 password hashing (100,000 iterations, 64-byte key, random 16-byte salt).
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `pbkdf2$100000$${salt}$${hash}`;
}

/**
 * Verifies password against PBKDF2, with backward compatibility for legacy SHA-256 and plaintext.
 */
export function verifyPassword(passwordPlain: string, storedHash: string | null | undefined): boolean {
  if (!storedHash || !passwordPlain) return false;

  // Modern PBKDF2 hash
  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return false;
    const iterations = parseInt(parts[1], 10);
    const salt = parts[2];
    const originalHash = parts[3];

    const computed = crypto.pbkdf2Sync(passwordPlain, salt, iterations, 64, 'sha512').toString('hex');
    const bufComputed = Buffer.from(computed, 'hex');
    const bufOriginal = Buffer.from(originalHash, 'hex');
    if (bufComputed.length !== bufOriginal.length) return false;
    return crypto.timingSafeEqual(bufComputed, bufOriginal);
  }

  // Legacy SHA-256 check
  const legacySha256 = crypto.createHash('sha256').update(passwordPlain).digest('hex');
  if (storedHash === legacySha256) {
    return true;
  }

  // Legacy plaintext check (fallback)
  return storedHash === passwordPlain;
}

/**
 * Creates a cryptographically signed session token.
 */
export function createSignedSessionToken(userId: string): string {
  const timestamp = Date.now().toString();
  const payload = `${userId}.${timestamp}`;
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

/**
 * Verifies the signed session token and extracts the userId.
 */
export function verifySessionToken(token: string): string | null {
  if (!token) return null;

  // Signed format: userId.timestamp.signature
  if (token.includes('.')) {
    const parts = token.split('.');
    if (parts.length === 3) {
      const [userId, timestamp, sig] = parts;
      const payload = `${userId}.${timestamp}`;
      const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');

      const bufSig = Buffer.from(sig);
      const bufExp = Buffer.from(expectedSig);
      if (bufSig.length === bufExp.length && crypto.timingSafeEqual(bufSig, bufExp)) {
        // Token valid for 30 days
        const ageMs = Date.now() - parseInt(timestamp, 10);
        if (ageMs >= 0 && ageMs < 1000 * 60 * 60 * 24 * 30) {
          return userId;
        }
      }
    }
    return null;
  }

  // Fallback for active sessions during rollout (UUID format only)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);
  return isUuid ? token : null;
}
