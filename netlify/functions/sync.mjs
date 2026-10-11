// Baan Ta Phai cloud sync.
//   GET                      public   – everyone reads the site data
//   POST ?action=login       public   – exchange the admin passphrase for a 12h session token
//   POST / PUT               ADMIN    – save site data (needs "Authorization: Bearer <session token>")
//
// Setup (Netlify -> Site configuration -> Environment variables):
//   ADMIN_TOKEN     required. The admin passphrase. Never put it in the repo or the HTML.
//   SESSION_SECRET  optional. Extra secret used to sign session tokens.
// If ADMIN_TOKEN is missing the function refuses every write (fail closed).
import { getStore } from "@netlify/blobs";
import {
  bearerToken, checkLock, clearFailures, recordFailure, safeEqual, signSession, verifySession,
} from "../lib/auth.mjs";

const MAX_BODY_BYTES = 6 * 1024 * 1024;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Netlify-CDN-Cache-Control": "no-store",
};

const json = (status, body, extra = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, ...extra } });

export async function handle(req, context, deps) {
  const { store, authStore, env = {}, now = Date.now() } = deps;
  const adminToken = env.ADMIN_TOKEN || "";
  const sessionSecret = env.SESSION_SECRET || "";

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

  try {
    const isWrite = req.method === "POST" || req.method === "PUT";
    let action = "";
    try { action = new URL(req.url).searchParams.get("action") || ""; } catch (e) {}

    // ---- Login: passphrase -> session token ----
    if (isWrite && action === "login") {
      if (!adminToken) return json(503, { success: false, error: "not_configured" });
      const ip = (context && context.ip) || req.headers.get("x-nf-client-connection-ip") || "unknown";

      const lock = await checkLock(authStore, ip, now);
      if (lock.locked) {
        return json(429, { success: false, error: "locked", retryAfterSec: lock.retryAfterSec },
          { "Retry-After": String(lock.retryAfterSec) });
      }

      let creds = null;
      try { creds = await req.json(); } catch (e) {}
      const given = creds && typeof creds.passphrase === "string" ? creds.passphrase : "";

      if (given && safeEqual(given, adminToken)) {
        await clearFailures(authStore, ip);
        const { token, expiresAt } = signSession(adminToken, sessionSecret, now);
        return json(200, { success: true, token, expiresAt });
      }
      await recordFailure(authStore, ip, now);
      return json(401, { success: false, error: "invalid_credentials" });
    }

    // ---- Save (admin only) ----
    if (isWrite) {
      if (!adminToken) return json(503, { success: false, error: "not_configured" });
      if (!verifySession(adminToken, sessionSecret, bearerToken(req), now)) {
        return json(401, { success: false, error: "unauthorized" });
      }

      let raw = "";
      try { raw = await req.text(); } catch (e) {}
      if (raw.length > MAX_BODY_BYTES) return json(413, { success: false, error: "Payload too large" });

      let body;
      try { body = JSON.parse(raw); } catch (e) {
        return json(400, { success: false, error: "Invalid JSON payload" });
      }
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return json(400, { success: false, error: "Payload must be an object" });
      }

      const timestamp = new Date(now).toISOString();
      await store.setJSON("site_data", { ...body, updatedAt: timestamp });
      return json(200, { success: true, message: "Data saved successfully to Baan Ta Phai Cloud", updatedAt: timestamp });
    }

    // ---- Read (public) ----
    if (req.method === "GET") {
      let since = null;
      try { since = new URL(req.url).searchParams.get("since"); } catch (e) {}

      const data = await store.get("site_data", { type: "json", consistency: "strong" });
      if (since && data && data.updatedAt && String(data.updatedAt) === String(since)) {
        return json(200, { success: true, notModified: true, updatedAt: data.updatedAt });
      }
      return json(200, { success: true, notModified: false, data: data || null });
    }

    return json(405, { success: false, error: "Method not allowed" });
  } catch (err) {
    console.error("Sync function error:", err);
    return json(500, { success: false, error: "Internal server error" });
  }
}

export default async (req, context) =>
  handle(req, context, {
    store: getStore({ name: "baantaphai_config", consistency: "strong" }),
    authStore: getStore({ name: "baantaphai_auth", consistency: "strong" }),
    env: process.env,
  });
