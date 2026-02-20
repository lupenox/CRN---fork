import { GetDefaultHeaders } from "./headers.ts";

type ResponseBody = {
    success : boolean,
    data ?: string | object | null,
    error ?: string | null
}

/**
 * Creates a standardized JSON HTTP response for CRN API endpoints.
 *
 * This helper wraps response data and error information into a consistent
 * response body format containing a success flag, optional data, and
 * optional error message. The HTTP status code defaults to 200 when no
 * error is provided and 500 when an error is present, unless explicitly
 * overridden via the init parameter. Default headers are also applied
 * if none are supplied.
 *
 * @param data Optional response payload to return to the client.
 * @param error Optional error message. If provided, success will be false.
 * @param init Optional ResponseInit configuration (status, headers, etc.).
 *
 * @returns A Response object containing the serialized JSON body.
 */
export default function CrnResponse(
    data ?: string | object | null,
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