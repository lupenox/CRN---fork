import { createRemoteJWKSet, jwtVerify } from "npm:jose";
import { syncAuth0User } from "./users.ts"; // <-- Import the new utility

const AUTH0_DOMAIN = "dev-85gf7oggpaitwy0i.us.auth0.com"; 
const AUDIENCE = "https://api.crn.uwm.edu";     

const JWKS = createRemoteJWKSet(
    new URL(`https://${AUTH0_DOMAIN}/.well-known/jwks.json`)
);

export async function verifyAuth0Token(req: Request) {
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];

    try {
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: `https://${AUTH0_DOMAIN}/`,
            audience: AUDIENCE,
        });
        
        // --- NEW: Sync the user to your local database ---
        if (payload.sub && typeof payload.email === 'string') {
            // payload.sub is the Auth0 ID. 
            // payload.nickname is often where Auth0 stores the username.
            await syncAuth0User(payload.sub, payload.email, payload.nickname as string);
        }
        // -------------------------------------------------

        return payload;
    } catch (err) {
        console.error("Token verification failed:", err);
        return null;
    }
}