import { getEvents, deleteEvent, createEvent, CrnEvent, updateEvent } from "../util/events.ts";
import CrnResponse from "../util/httpResponse.ts";
import parseJson from "../util/parseJson.ts";

export async function GET(req : Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    try {
        const events = await getEvents(id);
        return CrnResponse(events);
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
        return CrnResponse(deletedEvent);
    } catch (err) {
        return CrnResponse(null, String(err));
    }
}

export async function POST(req : Request) {
    const text = await req.text();
    let event : CrnEvent;
    try {
        event = parseJson<CrnEvent>(
            text,
            [
                'Title',
                'Date',
                'Location',
                'Description',
            ]
        );
        if(event == null) {
            throw new Error();
        }
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

export async function PATCH(req : Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if(id == null || !Number.isInteger(parseInt(id))) {
        return CrnResponse(
            null, 
            'ID missing from query params',
            { status: 400 }
        );
    }

    let obj : Record<string, string>;
    try {
        obj = JSON.parse(
            await req.text()
        );
    } catch {
        return CrnResponse(null, 'Invalid JSON');
    }

    if(
        await updateEvent(
            parseInt(id),
            obj
        )
    ) {
        return CrnResponse();
    } else {
        return CrnResponse(null, 'Failed to update');
    }
}