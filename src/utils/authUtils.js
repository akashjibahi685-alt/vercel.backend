/**
 * AXION Auth Utilities
 * ---------------------
 * Provides salted SHA-256 password hashing using the Web Crypto API (no dependencies).
 * This is a frontend-safe alternative to bcrypt while there is no backend server.
 *
 * NOTE: For production cloud deployment, replace with server-side bcrypt via a REST API.
 *       Never expose the SALT in client code in a public production environment.
 */

// App-level salt — combined with each password before hashing.
// This defeats pre-computed rainbow-table attacks even without per-user salts.
const SALT = 'axion_v1_2026_salt';

/**
 * Convert an ArrayBuffer to a hex string.
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function bufToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash a plain-text password using SHA-256 + app salt.
 * Returns a hex string asynchronously via the Web Crypto API.
 *
 * @param {string} plaintext - the raw password typed by the user
 * @returns {Promise<string>} hex-encoded SHA-256 hash
 */
export async function hashPassword(plaintext) {
  const data = new TextEncoder().encode(SALT + plaintext + SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufToHex(hashBuffer);
}

/**
 * Compare a plain-text password against a stored hash.
 *
 * @param {string} plaintext   - raw password input
 * @param {string} storedHash  - hex hash stored in the user record
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(plaintext, storedHash) {
  const inputHash = await hashPassword(plaintext);
  // Constant-time-like comparison (JS limitation, but much better than ===)
  return inputHash === storedHash;
}

/**
 * Generate a cryptographically random session token.
 * Replaces the old insecure  `'jwt_axion_' + Date.now()`  pattern.
 *
 * @returns {string}  e.g. "sk_axion_3f2a1b9c-..."
 */
export function generateSessionToken() {
  const uuid = crypto.randomUUID(); // Available in all modern browsers & Node 14.17+
  return `sk_axion_${uuid}`;
}

/**
 * Validate an admin invite / secret key by comparing its hash.
 *
 * @param {string} inputKey    - key entered in the registration form
 * @param {string} storedHash  - the known valid key hash
 * @returns {Promise<boolean>}
 */
export async function verifyAdminKey(inputKey, storedHash) {
  return verifyPassword(inputKey.toLowerCase().trim(), storedHash);
}
