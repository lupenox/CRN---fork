// api/util/users.ts
import { sql } from "../db.ts";

// 1. The New Schema (Notice 'id' is a string now, and no passwords!)
await sql`
    CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY, 
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255)
    );
`;

// 2. Just-In-Time (JIT) Provisioning Function
// This ensures that when a user logs in via Auth0, they are automatically added to your local DB.
export async function syncAuth0User(auth0Id: string, email: string, username?: string) {
    try {
        // PostgreSQL "UPSERT" - Inserts the user, but if they already exist, does nothing.
        await sql`
            INSERT INTO users (id, email, username, first_name, last_name)
            VALUES (${auth0Id}, ${email}, ${username ?? ''}, '', '')
            ON CONFLICT (id) DO NOTHING;
        `;
        return true;
    } catch (err) {
        console.error("Failed to sync Auth0 user to local DB:", err);
        return false;
    }
}