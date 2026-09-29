import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { rootDir, syncContent } from "./sync-content.js";

const task = process.argv[2];
if (!["dev:site", "build:site"].includes(task)) throw new Error("Unknown site task");
const workspace = syncContent();
const packageManager = process.env.npm_execpath;
if (!packageManager) throw new Error("Run this task through pnpm run");
const child = spawn(process.execPath, [packageManager, "run", task, ...process.argv.slice(3)], {
	cwd: workspace,
	stdio: "inherit",
	env: { ...process.env, ENABLE_CONTENT_SYNC: "false" },
});
child.on("error", (error) => { console.error(error.message); process.exitCode = 1; });
child.on("close", (code) => {
	if (code !== 0) { process.exitCode = code || 1; return; }
	if (task === "build:site" && workspace !== rootDir) {
		const output = path.join(rootDir, "dist");
		if (fs.lstatSync(output, { throwIfNoEntry: false })?.isSymbolicLink()) throw new Error("Refusing linked dist directory");
		fs.rmSync(output, { recursive: true, force: true });
		fs.cpSync(path.join(workspace, "dist"), output, { recursive: true });
	}
});
