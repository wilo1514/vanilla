import fs from "node:fs";
import path from "node:path";

function copyDirIfExists(source, target) {
  if (fs.existsSync(source)) {
    fs.cpSync(source, target, { recursive: true });
  }
}

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

fs.writeFileSync(path.join(process.cwd(), "dist", "app.js"), "import \"./hostinger/server.js\";\n");
fs.copyFileSync(path.join(process.cwd(), "package.json"), path.join(process.cwd(), "dist", "package.json"));
fs.copyFileSync(path.join(process.cwd(), "package-lock.json"), path.join(process.cwd(), "dist", "package-lock.json"));
copyDirIfExists(path.join(process.cwd(), "src", "templates"), path.join(process.cwd(), "dist", "src", "templates"));
copyDirIfExists(path.join(process.cwd(), "src", "hostinger"), path.join(process.cwd(), "dist", "src", "hostinger"));
copyDirIfExists(path.join(process.cwd(), "..", "mail_list"), path.join(process.cwd(), "dist", "mail_list"));
fs.writeFileSync(
  path.join(process.cwd(), "dist", ".htaccess"),
  [
    "PassengerEnabled on",
    "PassengerAppType node",
    "PassengerStartupFile app.js",
    "PassengerAppRoot /home/u871072566/domains/lemonchiffon-goat-232287.hostingersite.com/public_html",
    "PassengerNodejs /opt/alt/alt-nodejs22/root/usr/bin/node",
    "",
    "RewriteEngine On",
    "RewriteRule ^\\.builds - [F,L]",
    ""
  ].join("\n")
);
