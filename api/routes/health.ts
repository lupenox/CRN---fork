import { sql } from "../db.ts";
export const health = async () =>{
    try {
      const result = await sql`select 1 as ok`;
      return Response.json({ status: "ok", db: result[0]});
    } catch (err){
      return Response.json({ status: "error", message: (err as Error).message }, { status: 500 });
    }
};
