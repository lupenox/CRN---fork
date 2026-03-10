import { createRemoteJWKSet, jwtVerify } from "npm:jose";

// 1. Configuration (Move these to .env in production)
const AUTH0_DOMAIN = "dev-85gf7oggpaitwy0i.us.auth0.com"; // From your Auth0 Dashboard
const AUDIENCE = "https://api.crn.uwm.edu";     // The 'Identifier' you set in API setup

// 2. Setup Remote Key Fetching
// This automatically downloads the Public Key from Auth0 to verify signatures.
const JWKS = createRemoteJWKSet(
    new URL(`https://${AUTH0_DOMAIN}/.well-known/jwks.json`)
);

/**
 * Verifies the Bearer token from the request header.
 * Returns the payload if valid, or null if invalid.
 */
export async function verifyAuth0Token(req: Request) {
    const authHeader = req.headers.get("Authorization");
    
    // Check if header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];

    try {
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: `https://${AUTH0_DOMAIN}/`,
            audience: AUDIENCE,
        });
        
        // payload.sub is the unique User ID (e.g., "auth0|123456")
        return payload;
    } catch (err) {
        console.error("Token verification failed:", err);
        return null;
    }
}