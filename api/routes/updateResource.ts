import { GetDefaultHeaders } from "../util/headers.ts";
import { updatePocTable } from "../util/proofOfConcept.ts";

export async function POST(_req : Request) {
    let field;
    let value;
    try {
        const { field: f, value: v } = await _req.json();
        field = f;
        value = v;
    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: String(err) }), {
        status: 400,
        headers: GetDefaultHeaders(),
        });
    }

    const error = await updatePocTable(field, value);
    if(error != null) {
        return new Response(JSON.stringify({ success: false, error: error }), {
            status: 400,
            headers: GetDefaultHeaders(),
        });
    }

    return new Response(JSON.stringify({success: true, data: { field: field, value: value }}), {
        headers: GetDefaultHeaders(),
    });
}