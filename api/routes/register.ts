import {createUser} from "../util/auth.ts";
import CrnResponse from  "../util/httpResponse.ts";
import parseJson from "../util/parseJson.ts";

type RegisterDto = {
    email: string;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
};

export async function POST(req: Request){
    let payload: RegisterDto;
    try {
        const text = await req.text();
        payload = parseJson<RegisterDto>(text, ['email', 'password', 'username', 'first_name', 'last_name']);
    } catch {
        return CrnResponse(null, "Invalid JSON or missing required fields", {status: 400});
    }

    const success = await createUser(payload.email, payload.password, payload.username, payload.first_name, payload.last_name);
    if (success) {
        return CrnResponse({message: "User registered successfully"},);
    }else{
        return CrnResponse(null, "User registration failed", {status: 409});
    }
}