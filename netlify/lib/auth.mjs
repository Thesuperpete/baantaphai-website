// Admin session helpers for the Baan Ta Phai sync function.
// The admin passphrase lives ONLY in the Netlify environment variable ADMIN_TOKEN.
// A successful login returns a short-lived signed session token (HMAC-SHA256); the
// passphrase itself is never stored in the browser or the repository.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
export const MAX_FAILED_ATTEMPTS = 8;
export const LOCKOUT_MS = 15 * 60 * 1000;           // 15 minutes
const FAIL_WINDOW_MS = 15 * 60 * 1000;

const b64u = (v) => Buffer.from(v).toString("base64url");

/** Constant-time string comparison (hashes first so lengths never leak). */
export function safeEqual(a, b) {
  const ha = createHash("sha256").update(String(a)).digest();
  const hb = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

// Changing ADMIN_TOKEN automatically invalidates every existing session.
function signingKey(adminToken, sessionSecret) {
  return sessionSecret || createHmac("sha256", String(adminToken)).update("baantaphai-session-v1").digest("hex");
}

export function signSession(adminToken, sessionSecret, now = Date.now(), ttl = SESSION_TTL_MS) {
  const expiresAt = now + ttl;
  const body = b64u(JSON.stringify({ exp: expiresAt, v: 1 }));
  const sig = createHmac("sha256", signingKey(adminToken, sessionSecret)).update(body).digest("base64url");
  return { token: `${body}.${sig}`, expiresAt };
}

export function verifySession(adminToken, sessionSecret, token, now = Date.now()) {
  if (!adminToken || typeof token !== "string" || token.length > 512) return false;
  const [body, sig, extra] = token.split(".");
  if (!body || !sig || extra !== undefined) return false;
  const expected = createHmac("sha256", signingKey(adminToken, sessionSecret)).update(body).digest("base64url");
  if (!safeEqual(sig, expected)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return typeof exp === "number" && exp > now;
  } catch {
    return false;
  }
}

export function bearerToken(req) {
  const h = req.headers.get("authorization") || "";
  const m = /^Bearer\s+(.+)$/i.exec(h.trim());
  return m ? m[1] : "";
}

const guardKey = (ip) => "ip_" + createHash("sha256").update(String(ip || "unknown")).digest("hex").slice(0, 32);

/** Brute-force guard. Returns { locked, retryAfterSec } for this client IP. */
export async function checkLock(authStore, ip, now = Date.now()) {
  const rec = await authStore.get(guardKey(ip), { type: "json" });
  if (rec && rec.lockedUntil && rec.lockedUntil > now) {
    return { locked: true, retryAfterSec: Math.ceil((rec.lockedUntil - now) / 1000) };
  }
  return { locked: false, retryAfterSec: 0 };
}

export async function recordFailure(authStore, ip, now = Date.now()) {
  const key = guardKey(ip);
  const rec = (await authStore.get(key, { type: "json" })) || {};
  const fresh = rec.first && now - rec.first < FAIL_WINDOW_MS;
  const count = (fresh ? rec.count || 0 : 0) + 1;
  const next = { count, first: fresh ? rec.first : now };
  if (count >= MAX_FAILED_ATTEMPTS) next.lockedUntil = now + LOCKOUT_MS;
  await authStore.setJSON(key, next);
  return next;
}

export async function clearFailures(authStore, ip) {
  await authStore.delete(guardKey(ip));
}
