import { GetDefaultHeaders } from "./headers.ts";

type ResponseBody = {
    success : boolean,
    data ?: string | null,
    error ?: string | null
}

export default function CrnResponse(
    data ?: string | null,
    error ?: string | null,
    init ?: ResponseInit
) : Response {
    const success = error == null;
    const body : ResponseBody = {
        success : success,
        data : data,
        error : error
    };

    init = init ?? {};
    if(init.status == null) {
        init.status = success ? 200 : 500;
    }

    if(init.headers == null) {
        init.headers = GetDefaultHeaders();
    }

    return new Response(
        JSON.stringify(body),
        init
    );
}