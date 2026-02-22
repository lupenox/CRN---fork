import { getDynamicData } from "../util/dynamicDb.ts";
import CrnResponse from "../util/httpResponse.ts";

export async function GET(req : Request) {
    const url = new URL(req.url);
    const id = parseInt(
        url.searchParams.get('id') ?? ''
    );
    const table = url.searchParams.get('table');

    if(table == null) {
        return CrnResponse(
            null,
            'Table must be specified in query params',
            { status: 400 }
        );
    }

    let result;
    try {
        if(id == null || !Number.isInteger(id)) {
            result = await getDynamicData(table);
        } else {
            result = await getDynamicData(table, id);
        }
    } catch {
        return CrnResponse(
            null,
            'Table is not in the allow list',
            { status: 401 }
        );
    }

    return CrnResponse(result, null);
}