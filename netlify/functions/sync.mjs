import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json; charset=utf-8",
  };

  // 1. Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const store = getStore("baantaphai_config");

    // 2. Handle POST / PUT (Save from Admin)
    if (req.method === "POST" || req.method === "PUT") {
      let body;
      try {
        body = await req.json();
      } catch (parseErr) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid JSON payload" }),
          { status: 400, headers: corsHeaders }
        );
      }

      if (!body || typeof body !== "object") {
        return new Response(
          JSON.stringify({ success: false, error: "Payload must be an object" }),
          { status: 400, headers: corsHeaders }
        );
      }

      const timestamp = new Date().toISOString();
      const payload = {
        ...body,
        updatedAt: timestamp,
      };

      await store.setJSON("site_data", payload);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Data saved successfully to Baan Ta Phai Cloud",
          updatedAt: timestamp,
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // 3. Handle GET (Load site data for all visitors)
    if (req.method === "GET") {
      const data = await store.get("site_data", { type: "json" });
      return new Response(
        JSON.stringify({
          success: true,
          data: data || null,
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Sync function error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || "Internal server error",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};
