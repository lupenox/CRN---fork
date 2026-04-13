import postgres from "postgres";

const ssl = Deno.env.get("DEV") === 'true' ? undefined : 'require';
const db = Deno.env.get("DATABASE");
export const sql = postgres(
  Deno.env.get("DATABASE_URL")!,
  {
    ssl: ssl,
    db: db
  }
);