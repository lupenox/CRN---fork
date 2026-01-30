
import { serve } from 'std/http';
import { sql } from "./db.ts";

serve(async () => {
  const result = await sql`select 1 as ok`;
  return Response.json(
    result[0]
  );
});

