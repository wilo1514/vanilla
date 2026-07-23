import fs from "node:fs";
import path from "node:path";

const distServer = path.join(process.cwd(), "dist", "hostinger", "server.js");
if (!fs.existsSync(distServer)) {
  throw new Error("Expected dist/hostinger/server.js after TypeScript build.");
}

const publicDir = path.join(process.cwd(), "public");
fs.mkdirSync(publicDir, { recursive: true });

const publicIndex = path.join(publicDir, "index.html");
if (!fs.existsSync(publicIndex)) {
  fs.writeFileSync(
    publicIndex,
    "<!doctype html><html><head><meta charset=\"utf-8\"><title>The Vanilla Republic API</title></head><body>The Vanilla Republic API is running.</body></html>\n"
  );
}

fs.copyFileSync(path.join(process.cwd(), "app.js"), path.join(process.cwd(), "dist", "app.js"));
fs.copyFileSync(path.join(process.cwd(), "package.json"), path.join(process.cwd(), "dist", "package.json"));
fs.copyFileSync(path.join(process.cwd(), "package-lock.json"), path.join(process.cwd(), "dist", "package-lock.json"));
