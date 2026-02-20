import CrnResponse from "../util/httpResponse.ts";
import { updatePocTable } from "../util/proofOfConcept.ts";

export async function POST(_req : Request) {
    let field;
    let value;
    try {
        const { field: f, value: v } = await _req.json();
        field = f;
        value = v;
    } catch (err) {
        return CrnResponse(
            null, 
            String(err),
            { status: 400 }
        );
    }

    const error = await updatePocTable(field, value);
    if(error != null) {
        return CrnResponse(null, error, { status: 500 });
    }

    return CrnResponse({ field: field, value: value });
}