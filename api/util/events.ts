import { sql, EVENTS_TABLE_NAME } from "../db.ts";

export type CrnEvent = {
    Title : string,
    Date : string,
    Location : string,
    Description : string,
    Organizer : string | null
}

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
                ${event.Organizer ?? ''}
            );
        `;
    } catch(err) {
        console.error(err);
        return false;
    }

    return true;
}

/**
 * @param id of event to update
 * @param fields event fields to update
 * @returns true on success and false on failure
 */
export async function updateEvent(id : number, fields : Record<string, string>) {
    const keys : (keyof CrnEvent)[] = [
        'Title',
        'Date',
        'Location',
        'Description',
        'Organizer'
    ];

    const validRecords: Record<string, string> = {};
    for (const k of keys) {
        if (fields[k] != null) {
            validRecords[k.toLowerCase()] = fields[k];
        }
    }

    const entries = Object.entries(validRecords);
    if(entries.length === 0) {
        return false;
    }

    const setClause = entries
        .map(
            ([k, v]) => sql`${sql(k)} = ${v}`
        )
        .reduce(
            (prev, curr) => sql`${prev}, ${curr}`
        );

    try {
        await sql`
            UPDATE ${sql(EVENTS_TABLE_NAME)}
            SET ${setClause}
            WHERE id = ${id}
        `;
    } catch(err) {
        console.log(err);
        return false;
    }

    return true;
}