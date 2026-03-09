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
            result = await sql`
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
            records[col] = obj.get(col) as string;
        }
    }

    if(records['id'] == null && id != null) {
        records['id'] = '' + id;
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