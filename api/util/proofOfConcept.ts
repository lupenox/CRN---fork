import { PocTableName, sql } from "../db.ts";

export async function updatePocTable(name : string, value : string) {
    await sql`
        insert into ${sql(PocTableName)} (name, value)
        values (${name}, ${value});
    `;
}