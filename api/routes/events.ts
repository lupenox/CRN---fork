import { GetDefaultHeaders } from "../util/headers.ts";
import { getEvents, deleteEvent } from "../util/events.ts";

export async function GET(req : Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    try {
        const events = await getEvents(id);
        return new Response(JSON.stringify({success: true, data: events}), {
            headers: GetDefaultHeaders(),
        });
    } catch (err) {
        return new Response(JSON.stringify({success: false, error: String(err)}), {
            status: 500,
            headers: GetDefaultHeaders(),
        });
    }
}

export async function DELETE(req : Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
        return new Response(JSON.stringify({success: false, error: "Event ID is required"}), {
            status: 400,
            headers: GetDefaultHeaders(),
        });
    }
    try {
        const deletedEvent = await deleteEvent(id);
        return new Response(JSON.stringify({success: true, data: deletedEvent}), {
            headers: GetDefaultHeaders(),
        });
    } catch (err) {
        return new Response(JSON.stringify({success: false, error: String(err)}), {
            status: 404,
            headers: GetDefaultHeaders(),
        });
    }
}