
// db.ts
import postgres from "postgres";

export const sql = postgres(
  Deno.env.get("DATABASE_URL")!,
  {
    ssl: "require",
  }
);
