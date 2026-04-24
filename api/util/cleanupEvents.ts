import { sql, EVENTS_TABLE_NAME } from "../db.ts"; 

export async function cleanExpiredEvents() {
  try {
    const result = await sql`
      DELETE FROM ${sql(EVENTS_TABLE_NAME)} 
      WHERE (date::timestamp) < CURRENT_TIMESTAMP
      RETURNING id, title;
    `;

    console.log(`Successfully removed ${result.length} expired events.`);
  } catch (err) {
    console.error("Database cleanup error:", err);
  }
}

if (import.meta.main) {
  cleanExpiredEvents().then(() => Deno.exit());
}