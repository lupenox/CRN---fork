import allowedJson from "./files/allowed-tables.json" with { type: 'json' };
import { sql } from "../db.ts";

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

    const columns = sql(allowedTables.get(table) as string[]);

    let result;
    try {
        if(id == null) {
            result = sql`
                SELECT ${columns} FROM ${sql(table)};
            `;
        } else {
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