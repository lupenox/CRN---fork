import { sql } from "./db.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.url.endsWith("/health")) {
    return new Response(JSON.stringify({ status: "ok" }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
//TODO call db function
if (req.method === "PATCH" && req.url.endsWith("/update-resource")) {
  try {
    const { id, field, value } = await req.json();
    // TODO call db function
    return new Response(JSON.stringify({success: true, data: updatedResource}), {
      headers: { 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "*" 
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 400,
      headers: { 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "*" 
      },
    });
  }
}

  const result = await sql`SELECT 1 AS ok`;
  return new Response(JSON.stringify(result[0]), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});

