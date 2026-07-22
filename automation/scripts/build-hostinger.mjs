import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const automationRoot = path.resolve(here, "..");
const repoRoot = path.resolve(automationRoot, "..");
const websiteRoot = path.join(repoRoot, "website", "current_site");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env ?? process.env,
    stdio: "inherit"
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function npm(args, options = {}) {
  if (process.env.npm_execpath) {
    run(process.execPath, [process.env.npm_execpath, ...args], options);
    return;
  }
  run("npm", args, options);
}

const websiteEnv = {
  ...process.env,
  VITE_SAMPLE_REQUEST_ENDPOINT: process.env.VITE_SAMPLE_REQUEST_ENDPOINT || "/webhooks/sample-request",
  VITE_DEBUG_FORMS: process.env.VITE_DEBUG_FORMS || "false"
};

if (fs.existsSync(path.join(websiteRoot, "package.json"))) {
  npm(["install"], { cwd: websiteRoot });
  npm(["run", "build"], { cwd: websiteRoot, env: websiteEnv });
} else {
  console.log("Website folder not found; building API only.");
}
run(process.execPath, [path.join(automationRoot, "node_modules", "typescript", "bin", "tsc"), "-p", "tsconfig.json"], { cwd: automationRoot });
