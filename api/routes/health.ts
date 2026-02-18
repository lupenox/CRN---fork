import { GetDefaultHeaders } from "../util/headers.ts";

export function GET(_req : Request) {
  return new Response(JSON.stringify({ status: "ok" }), {
    headers: GetDefaultHeaders(),
  });
}
