const defaultHeaders : Record<string, string> = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
};

export function GetDefaultHeaders() {
    const header : Record<string, string> = {};
    for(const k in defaultHeaders) {
        header[k] = defaultHeaders[k];
    }

    return header;
}