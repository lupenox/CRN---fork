import { sql } from "../db.ts";

await sql`
    CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        date VARCHAR(100) NOT NULL,
        location TEXT,
        description TEXT,
        organizer VARCHAR(255)
    );
`;

export const getEvents = async (id?: string | null ) => {
    if (id) {
        return await sql`SELECT * FROM events WHERE id = ${id}`;
    } 
    return await sql`SELECT * FROM events`;
}

export const deleteEvent = async (id: string) => {
    const result = await sql`
        DELETE FROM events 
        WHERE id = ${id}
        RETURNING *;
    `;

    if (result.length === 0) {
        throw new Error(`Event with id ${id} not found`);
    }
    return result[0];
};