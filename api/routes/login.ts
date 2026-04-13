// import {verifyUserAndGetToken} from "../util/auth.ts";
// import CrnResponse from  "../util/httpResponse.ts";
// import parseJson from "../util/parseJson.ts";

// type LoginDto = {
//     email: string;
//     password: string;
// };

// export async function POST(req: Request){
//     let payload: LoginDto;
//     try {
//         const text = await req.text();
//         payload = parseJson<LoginDto>(text, ['email', 'password']);
//     } catch {
//         return CrnResponse(null, "Invalid JSON or missing required fields", {status: 400});
//     }

//     const token = await verifyUserAndGetToken(payload.email, payload.password);
//     if (token) {
//         return CrnResponse({token: token});
//     } else {
//         return CrnResponse(null, "Invalid email or password", {status: 401});
//     }
// }