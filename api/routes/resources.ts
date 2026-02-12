import { sql } from "../db.ts";

export const updateResourceField = async ( id: number, field: string, value: string | number) => {
    const allowedColumns = ["name", "description", "location", "hours"];
    if (!allowedColumns.includes(field)) throw new Error("Invalid field");

    const result = await sql`
        UPDATE resources
        SET ${sql(field)} = ${value}
        WHERE id = ${id}
        RETURNING *;
    `;
    return result;
}