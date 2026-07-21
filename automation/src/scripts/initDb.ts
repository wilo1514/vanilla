import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { closeDb, query } from "../db.js";

export async function initDb(): Promise<{ ok: true; schema: string }> {
  const schemaPath = path.resolve(process.cwd(), "src", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  await query(schema);
  return { ok: true, schema: schemaPath };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  initDb()
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .finally(() => closeDb());
}
