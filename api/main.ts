import { serve } from "std/http";
import { sql } from "./db.ts";

serve(async (req) => {
  if (req.url.endsWith("/health")) {
    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await sql`SELECT 1 AS ok`;
  return new Response(JSON.stringify(result[0]), {
    headers: { "Content-Type": "application/json" },
  });
});
