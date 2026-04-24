import { sql, EVENTS_TABLE_NAME, EVENT_STATS_TABLE_NAME } from "../db.ts";
import { hasEvent } from "./events.ts";

export async function logAppStat(table : string, id : number) {
    switch(table.toLowerCase()) {
        case EVENTS_TABLE_NAME:
            await logEventAccess(id);
            break;
        default:
            break;
    }
}

async function hasEventLog(eventId : number) {
    let res;
    try {
        res = await sql`
            SELECT * FROM ${sql(EVENT_STATS_TABLE_NAME)}
            WHERE eventId = ${eventId};
        `;
    } catch(e) {
        console.error(e);
        return false;
    }

    return res.count > 0;
}

async function logEventAccess(eventId : number) {
    if(!(await hasEvent(eventId))) {
        return;
    }

    try {
        if(await hasEventLog(eventId)) {
            await sql`
                UPDATE ${sql(EVENT_STATS_TABLE_NAME)}
                SET accessRequests = accessRequests + 1
                WHERE eventId = ${eventId};
            `;
        } else {
            await sql`
                INSERT INTO ${sql(EVENT_STATS_TABLE_NAME)}
                (eventId, accessRequests)
                VALUES
                (${eventId}, 1);
            `;
        }
    } catch(e) {
        console.error(e);
    }
}