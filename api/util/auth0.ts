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
        
        // --- UPDATED: Read the Namespaced Custom Claims ---
        const namespace = "https://api.crn.uwm.edu";
        const userEmail = payload[`${namespace}/email`] as string | undefined;
        const userName = payload[`${namespace}/username`] as string | undefined;

        if (payload.sub && userEmail) {
            // It found the email! Now it will ACTUALLY sync to the database.
            await syncAuth0User(payload.sub, userEmail, userName);
        }
        // -------------------------------------------------

        return payload;
    } catch (err) {
        console.error("Token verification failed:", err);
        return null;
    }
}