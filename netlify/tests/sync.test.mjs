import test from "node:test";
import assert from "node:assert/strict";
import { handle } from "../functions/sync.mjs";
import { signSession, verifySession, SESSION_TTL_MS, MAX_FAILED_ATTEMPTS } from "../lib/auth.mjs";

class MemStore {
  constructor() { this.m = new Map(); }
  async get(k) { return this.m.has(k) ? JSON.parse(this.m.get(k)) : null; }
  async setJSON(k, v) { this.m.set(k, JSON.stringify(v)); }
  async delete(k) { this.m.delete(k); }
}
const PASS = "correct horse battery staple";
const ENV = { ADMIN_TOKEN: PASS };
const ctx = { ip: "203.0.113.7" };
const url = (q = "") => "https://example.test/.netlify/functions/sync" + q;
const req = (method, { q = "", body, token } = {}) =>
  new Request(url(q), {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
const mk = (env = ENV, now = Date.now()) => ({ store: new MemStore(), authStore: new MemStore(), env, now });
const login = async (d, passphrase = PASS) => handle(req("POST", { q: "?action=login", body: { passphrase } }), ctx, d);

test("writes are refused when ADMIN_TOKEN is not configured (fail closed)", async () => {
  const d = mk({});
  assert.equal((await handle(req("POST", { body: { a: 1 } }), ctx, d)).status, 503);
  assert.equal((await login(d)).status, 503);
});

test("anonymous or forged writes are rejected and nothing is stored", async () => {
  const d = mk();
  assert.equal((await handle(req("POST", { body: { rooms: {} } }), ctx, d)).status, 401);
  assert.equal((await handle(req("PUT", { body: { rooms: {} }, token: "x.y" }), ctx, d)).status, 401);
  assert.equal(await d.store.get("site_data"), null);
});

test("login with the right passphrase returns a token that can save", async () => {
  const d = mk();
  const r = await login(d);
  assert.equal(r.status, 200);
  const { token } = await r.json();
  const save = await handle(req("POST", { body: { hero: { title1: "X" } }, token }), ctx, d);
  assert.equal(save.status, 200);
  assert.equal((await d.store.get("site_data")).hero.title1, "X");
});

test("wrong passphrase is rejected", async () => {
  const d = mk();
  assert.equal((await login(d, "nope")).status, 401);
  assert.equal((await login(d, "")).status, 401);
});

test("brute force: locked after repeated failures, even for the right passphrase", async () => {
  const d = mk();
  for (let i = 0; i < MAX_FAILED_ATTEMPTS; i++) assert.equal((await login(d, "bad" + i)).status, 401);
  const locked = await login(d);
  assert.equal(locked.status, 429);
  assert.ok(Number(locked.headers.get("Retry-After")) > 0);
  // lock expires
  const later = { ...d, now: d.now + 16 * 60 * 1000 };
  assert.equal((await login(later)).status, 200);
});

test("tampered, other-secret and expired tokens are rejected", async () => {
  const d = mk();
  const { token } = await (await login(d)).json();
  const [body, sig] = token.split(".");
  const forged = Buffer.from(JSON.stringify({ exp: Date.now() + 1e9, v: 1 })).toString("base64url") + "." + sig;
  assert.equal((await handle(req("POST", { body: { a: 1 }, token: forged }), ctx, d)).status, 401);
  assert.equal((await handle(req("POST", { body: { a: 1 }, token: body + ".AAAA" }), ctx, d)).status, 401);
  const other = signSession("another passphrase", "", Date.now()).token;
  assert.equal((await handle(req("POST", { body: { a: 1 }, token: other }), ctx, d)).status, 401);
  const expired = { ...d, now: d.now + SESSION_TTL_MS + 1000 };
  assert.equal((await handle(req("POST", { body: { a: 1 }, token }), ctx, expired)).status, 401);
});

test("changing ADMIN_TOKEN invalidates existing sessions", async () => {
  const d = mk();
  const { token } = await (await login(d)).json();
  assert.equal(verifySession(PASS, "", token), true);
  assert.equal(verifySession("new passphrase", "", token), false);
});

test("authorized save validates the payload", async () => {
  const d = mk();
  const { token } = await (await login(d)).json();
  assert.equal((await handle(req("POST", { body: "not json", token }), ctx, d)).status, 400);
  assert.equal((await handle(req("POST", { body: [1, 2], token }), ctx, d)).status, 400);
  assert.equal((await handle(req("POST", { body: "null", token }), ctx, d)).status, 400);
});

test("reading stays public, supports 'since', and preflight works", async () => {
  const d = mk();
  const { token } = await (await login(d)).json();
  const saved = await (await handle(req("POST", { body: { hero: { a: 1 } }, token }), ctx, d)).json();
  const get = await (await handle(req("GET"), ctx, d)).json();
  assert.equal(get.data.hero.a, 1);
  const same = await (await handle(req("GET", { q: "?since=" + encodeURIComponent(saved.updatedAt) }), ctx, d)).json();
  assert.equal(same.notModified, true);
  assert.equal((await handle(new Request(url(), { method: "OPTIONS" }), ctx, d)).status, 204);
  assert.equal((await handle(req("DELETE"), ctx, d)).status, 405);
});
