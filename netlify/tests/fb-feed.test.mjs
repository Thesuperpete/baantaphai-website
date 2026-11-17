import test from "node:test";
import assert from "node:assert/strict";
import { handle } from "../functions/fb-feed.mjs";

const get = () => new Request("https://example.test/.netlify/functions/fb-feed");
const fb = (status, body) => async () => new Response(JSON.stringify(body), { status });

test("refuses when FB_PAGE_TOKEN is not set", async () => {
  const r = await handle(get(), { env: {}, fetchFn: fb(200, {}) });
  assert.equal(r.status, 503);
});

test("returns trimmed posts, drops empty ones, never leaks the token", async () => {
  const data = [
    { id: "1", message: "สวัสดี", created_time: "2026-10-30T01:00:00+0000", full_picture: "https://i/1.jpg", permalink_url: "https://fb/1", extra: "x" },
    { id: "2", permalink_url: "https://fb/2" },
    { id: "3", message: "no link" },
    { id: "4", full_picture: "https://i/4.jpg", permalink_url: "https://fb/4" },
  ];
  let called = "";
  const r = await handle(get(), { env: { FB_PAGE_TOKEN: "SECRET" }, fetchFn: async (u) => { called = u; return new Response(JSON.stringify({ data })); } });
  assert.equal(r.status, 200);
  const body = await r.json();
  assert.deepEqual(body.posts.map((p) => p.id), ["1", "4"]);
  assert.equal(body.posts[0].extra, undefined);
  assert.ok(called.includes("access_token=SECRET"));
  assert.ok(!JSON.stringify(body).includes("SECRET"));
  assert.match(r.headers.get("Netlify-CDN-Cache-Control"), /s-maxage=600/);
});

test("Facebook error becomes a generic 502 and is not cached", async () => {
  const r = await handle(get(), { env: { FB_PAGE_TOKEN: "t" }, fetchFn: fb(400, { error: { code: 190, type: "OAuthException", message: "Error validating access token t" } }) });
  assert.equal(r.status, 502);
  const text = await r.text();
  assert.ok(!text.includes("OAuthException") && !text.includes("validating"));
  assert.equal(r.headers.get("Netlify-CDN-Cache-Control"), "no-store");
});

test("network failure is a 502, other methods are 405", async () => {
  const boom = async () => { throw new Error("down"); };
  assert.equal((await handle(get(), { env: { FB_PAGE_TOKEN: "t" }, fetchFn: boom })).status, 502);
  assert.equal((await handle(new Request("https://example.test/x", { method: "POST" }), { env: { FB_PAGE_TOKEN: "t" } })).status, 405);
});
