// Latest posts of the Facebook page, for the "ฟีดล่าสุดจากเพจ" panel. Public, read-only; the page token never leaves the server.
//   GET  -> { success: true, posts: [{ id, text, time, image, url }] }   (CDN-cached for 10 minutes)
//
// Setup (Netlify -> Site configuration -> Environment variables):
//   FB_PAGE_TOKEN  required. A long-lived PAGE access token for the Baantaphai page (permission pages_read_engagement).
// If it is missing or Facebook refuses it, the response is an error and the site falls back to the Facebook iframe plugin.
const POSTS = 6;

const json = (status, body, cache) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
      "Netlify-CDN-Cache-Control": cache || "no-store",
    },
  });

export async function handle(req, deps) {
  const { env = {}, fetchFn = fetch } = deps;
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*" } });
  if (req.method !== "GET") return json(405, { success: false, error: "method_not_allowed" });
  const token = env.FB_PAGE_TOKEN || "";
  if (!token) return json(503, { success: false, error: "not_configured" });

  try {
    const q = new URLSearchParams({
      fields: "message,created_time,full_picture,permalink_url",
      limit: String(POSTS + 4), // a few spare: photo-less shares and empty posts are dropped below
      access_token: token,
    });
    const r = await fetchFn(`https://graph.facebook.com/me/published_posts?${q}`);
    const j = await r.json().catch(() => null);
    if (!r.ok || !j || !Array.isArray(j.data)) {
      console.error("fb-feed: Facebook refused the request", r.status, j && j.error && j.error.code, j && j.error && j.error.type);
      return json(502, { success: false, error: "facebook_error" });
    }
    const posts = j.data
      .filter((p) => (p.message || p.full_picture) && p.permalink_url)
      .slice(0, POSTS)
      .map((p) => ({ id: p.id, text: p.message || "", time: p.created_time, image: p.full_picture || "", url: p.permalink_url }));
    if (!posts.length) return json(200, { success: true, posts: [] }, "public, s-maxage=120");
    return json(200, { success: true, posts }, "public, s-maxage=600, stale-while-revalidate=3600");
  } catch (err) {
    console.error("fb-feed error:", err && err.message);
    return json(502, { success: false, error: "facebook_error" });
  }
}

export default async (req) => handle(req, { env: process.env });
