import { sql } from "../db.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

await sql`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
    );
`;

const JWT_SECRET = Deno.env.get("JWT_SECRET")
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
}

export async function createUser(email: string, password: string): Promise<boolean> {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await sql`
            INSERT INTO users (email, password_hash) 
            VALUES (${email}, ${hash});
        `;
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function verifyUserAndGetToken(email: string, password: string): Promise<string | null> {
    try {
        const result = await sql`
            SELECT id, email, password_hash FROM users WHERE email = ${email};
        `;
        if (result.length===0) return null;

        const user = result[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) return null;

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "24h" }
        );
        return token;
    } catch (err) {
        console.error(err);
        return null;
    }
}
