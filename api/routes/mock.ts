import { GetDefaultHeaders } from "../util/headers.ts";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  if (type !== "events" && type !== "resources") {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Missing or invalid "type" param. Use ?type=events or ?type=resources',
      }),
      { status: 400, headers: GetDefaultHeaders() }
    );
  }

  const filePath = type === "events"
    ? "./data/mockEvents.json"
    : "./data/mockResources.json";

  try {
    const raw = await Deno.readTextFile(filePath);
    const data = JSON.parse(raw);
    return new Response(JSON.stringify({ success: true, data }), {
      headers: GetDefaultHeaders(),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: GetDefaultHeaders() }
    );
  }
}
