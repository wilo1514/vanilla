import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

dotenv.config();

async function main() {
  if ((process.env.DB_DRIVER ?? "memory") !== "mysql") {
    throw new Error("Set DB_DRIVER=mysql and MySQL credentials before running this migration.");
  }
  const schema = fs.readFileSync(path.resolve(process.cwd(), "src", "hostinger", "schema.mysql.sql"), "utf8");
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true
  });
  try {
    await connection.query(schema);
    console.log(JSON.stringify({ ok: true, migrated: true, database: process.env.MYSQL_DATABASE }, null, 2));
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
