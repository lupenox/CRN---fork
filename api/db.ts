import postgres from "postgres";

export const sql = postgres(
  Deno.env.get("DATABASE_URL")!,
  {
    ssl: "require",
  }
);

// db setup
export const PocTableName = 'poc_test';
await sql`
  create table if NOT exists ${sql(PocTableName)} (
      id serial primary key,
      name text,
      value text
  );
`;