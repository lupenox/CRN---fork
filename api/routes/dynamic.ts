import { 
	getDynamicData, 
	postDynamicData,
	delDynamicData
} from "../util/dynamicDb.ts";

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
        if(Number.isInteger(id)) {
            result = await getDynamicData(table, id);
        } else {
            result = await getDynamicData(table);
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

export async function POST(req : Request) {
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

    let obj;
    try {
        obj = JSON.parse(await req.text());
    } catch {
        return CrnResponse(
            null,
            'Invalid json',
            { status: 400 }
        );
    }

    const map = new Map<string, string>(Object.entries(obj));

    let result;
    try {
        if(Number.isInteger(id)) {
            result = await postDynamicData(table, id, map);
        } else {
            result = await postDynamicData(table, null, map);
        }
    } catch(err) {
        console.log(err);
        return CrnResponse(
            null,
            'Table is not in the allow list',
            { status: 401 }
        );
    }

    return CrnResponse(result, null);
}

export async function DELETE(req: Request){
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
        if(Number.isInteger(id)) {
            result = await delDynamicData(table, id);
        }
	} catch(err) {
        console.log(err);
        return CrnResponse(
            null,
            'Failed to delete record',
            { status: 500 }
        );
    }

    return CrnResponse(result, null);
}
