import { sql } from "../db.ts";

export type CrnEvent = {
    Title : string,
    Date : string,
    Location : string,
    Description : string,
    Organizer : string | null
}

const EVENTS_TABLE_NAME = 'events';

await sql`
    CREATE TABLE IF NOT EXISTS ${sql(EVENTS_TABLE_NAME)} (
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
        return await sql`SELECT * FROM ${sql(EVENTS_TABLE_NAME)} WHERE id = ${id};`;
    } 
    return await sql`SELECT * FROM ${sql(EVENTS_TABLE_NAME)};`;
}

export const deleteEvent = async (id: string) => {
    const result = await sql`
        DELETE FROM ${sql(EVENTS_TABLE_NAME)} 
        WHERE id = ${id}
        RETURNING *;
    `;

    if (result.length === 0) {
        throw new Error(`Event with id ${id} not found`);
    }
    return result[0];
};

/**
 * @param event to insert into Events table
 * @returns true on success and false on failure
 */
export async function createEvent(event : CrnEvent) {
    try {
        await sql`
            INSERT INTO ${sql(EVENTS_TABLE_NAME)} 
                (title, date, location, description, organizer)
            VALUES (
                ${event.Title},
                ${event.Date},
                ${event.Location},
                ${event.Description},
                    ${event.Organizer}
            );
        `;
    } catch(err) {
        console.error(err);
        return false;
    }

    return true;
}