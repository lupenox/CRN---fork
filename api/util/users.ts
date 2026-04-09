// api/util/users.ts
import { sql } from "../db.ts";

// Just-In-Time (JIT) Provisioning Function
// This assumes the 'users' table and 'user_role' ENUM were already created by your migrations!
export async function syncAuth0User(auth0_Id: string, email: string, name?: string) {
    try {
        await sql`
            INSERT INTO users (auth0_id, email, name)
            VALUES (${auth0_Id}, ${email}, ${name ?? 'Campus Navigator'})
            ON CONFLICT (auth0_id) DO NOTHING;
        `;
        return true;
    } catch (err) {
        console.error("Failed to sync Auth0 user to local DB:", err);
        return false;
    }
}