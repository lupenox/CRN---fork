import { GetDefaultHeaders } from "../util/headers.ts";
import CrnResponse from "../util/httpResponse.ts";

// from docs https://docs.deno.com/examples/file_based_routing_tutorial/
async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    const headers = GetDefaultHeaders();
    headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    return new Response(null, {
      headers: headers,
    });
  }

  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;
  let module;

  try {
    module = await import(`.${path}.ts`);
  } catch (_error) {
    return CrnResponse(null, 'Not found', { status: 404 });
  }

  if (module[method]) {
    return module[method](req);
  }

  return CrnResponse(null, 'Method not implemented', { status: 501 });
}

Deno.serve(handler);