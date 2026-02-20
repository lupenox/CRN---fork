import { getEvents, deleteEvent, createEvent, CrnEvent } from "../util/events.ts";
import CrnResponse from "../util/httpResponse.ts";

export async function GET(req : Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    try {
        const events = await getEvents(id);
        return CrnResponse(JSON.stringify(events));
    } catch (err) {
        return CrnResponse(null, String(err));
    }
}

export async function DELETE(req : Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
        return CrnResponse(
            null, 
            'Event ID is required',
            {
                status: 400
            }
        );
    }
    try {
        const deletedEvent = await deleteEvent(id);
        return CrnResponse(JSON.stringify(deletedEvent));
    } catch (err) {
        return CrnResponse(null, String(err));
    }
}

export async function POST(req : Request) {
    const text = await req.text();
    let event : CrnEvent;
    try {
        event = (await JSON.parse(text));
    } catch {
        return CrnResponse(
            null,
            'Incorrect JSON format',
            {
                status: 400
            }
        );
    }

    if(await createEvent(event)) {
        return CrnResponse();
    } else {
        return CrnResponse(null, 'Failed to insert event in database');
    }
}