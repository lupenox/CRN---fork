import { PocTableName, sql } from "../db.ts";

/**
 * Tries to update the proof of concept table
 * @param name 
 * @param value 
 * @returns null on success and an error if it fails
 */
export async function updatePocTable(
    name : string, 
    value : string
) : Promise<string | null> {
    try {
        await sql`
            insert into ${sql(PocTableName)} (name, value)
            values (${name}, ${value});
        `;
    } catch(e) {
        const err = e as Error;
        if(err == null) {
            return 'an error occurred';
        }

        return err.message;
    }

    return null;
}