import { closeDb, query } from "../db.js";
import { pathToFileURL } from "node:url";

export async function healthcheck(): Promise<{ ok: true; database_time: string }> {
  const result = await query<{ now: Date }>("select now()");
  return { ok: true, database_time: result.rows[0].now.toISOString() };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  healthcheck()
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .finally(() => closeDb());
}
