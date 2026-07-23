import fs from "node:fs";

const compiledFromProjectRoot = new URL("./dist/hostinger/server.js", import.meta.url);
const compiledFromPublishedOutput = new URL("./hostinger/server.js", import.meta.url);

await import(fs.existsSync(compiledFromProjectRoot) ? compiledFromProjectRoot.href : compiledFromPublishedOutput.href);
