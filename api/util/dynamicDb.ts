import allowedJson from "./files/allowed-tables.json" with { type: 'json' };
import { sql } from "../db.ts";
import { logAppStat } from "./appStats.ts";

type Table = {
    name : string,
    allowedColumns : string[]
}

const allowedTables = new Map<string, string[]>();
for(const t of allowedJson as Table[]) {
    allowedTables.set(t.name, t.allowedColumns);
}

function isAllowedTable(name : string) {
    return allowedTables.has(name);
}

/**
 * @param table name of table to query
 * @param id of entry to query
 * @returns query result on success and null if it fails
 * @throws if table is not allowed
 */
export async function getDynamicData(
    table : string,
    id ?: number | null
) : Promise<object | null> {
    if(!isAllowedTable(table)) {
        throw new Error('Table is not in the allowlist');
    }

    const rawColumns = (
            allowedTables.get(table) as string[]
        ).map(s => s.toLowerCase());

    const columns = sql(rawColumns);

    let result;
    try {
        if(id == null) {
            result = await sql`
                SELECT ${columns} FROM ${sql(table)};
            `;
        } else {
            await logAppStat(table, id);
            result = await sql`
                SELECT ${columns} FROM ${sql(table)} WHERE id = ${id};
            `;
        }
    } catch(err) {
        console.error(err);
        return null;
    }

    return result;
}

export async function postDynamicData(
    table : string,
    id : number | null,
    obj : Map<string, string>
) : Promise<object | null> {
    if(!isAllowedTable(table)) {
        throw new Error('Table is not in the allowlist');
    }

    const allowedColumns = allowedTables.get(table) as string[];
    const records : Record<string, string> = {};
    for(const col of allowedColumns) {
        if(col != 'id' && obj.has(col)) {
            records[col.toLowerCase()] = obj.get(col) as string;
        }
    }

    let result;
    try {
        if(id != null) {
            result = await sql`
                UPDATE ${sql(table)}
                SET ${sql(records)}
                WHERE id = ${id};
            `;
        } else {
            result = await sql`
                INSERT INTO ${sql(table)} ${sql(records)};
            `;
        }
    } catch(err) {
        console.error(err);
        return null;
    }

    return result;
}


/**
 * Helper function to handle the deletion of an entry
 * from the database
 * @param table, name of table for entry to delete
 * @param id of entry to delete 
 * @returns delete result on success and null if it fails
 * @throws if table is not allowed OR id is null
 */
export async function delDynamicData(
    table : string,
    id : number | null
) : Promise<object | null> {
    if(!isAllowedTable(table))
        throw new Error('delDynamicData: Table is not in the allowlist');

    let result;
    try {
        if(id == null)
			throw new Error('delDynamicData: Need id to delete');

		result = await sql`
			DELETE FROM ${sql(table)} WHERE id = ${id};
		`;
    } catch(err) {
        console.error(err);
        return null;
    }

    return result;
}
