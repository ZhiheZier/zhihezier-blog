import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./load-env.js";

export const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Private content is copied only into an ignored workspace, never tracked defaults.
export function prepareWorkspace(root, content) {
	const workspace = path.join(root, ".content-workspace");
	if (fs.lstatSync(workspace, { throwIfNoEntry: false })?.isSymbolicLink()) throw new Error("Refusing linked workspace");
	const relativeContent = path.relative(root, content);
	if (!relativeContent || content === workspace || content.startsWith(workspace + path.sep)) throw new Error("Invalid content source");
	const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
	git("check-ignore", "--quiet", ".content-workspace/privacy-check");
	if (!relativeContent.startsWith("..") && !path.isAbsolute(relativeContent)) git("check-ignore", "--quiet", relativeContent.replaceAll(path.sep, "/") + "/privacy-check");
	const tracked = git("ls-files", "-z").split("\0").filter(Boolean);
	if (tracked.some((name) => name.startsWith(".content-workspace/") || name.startsWith("content/"))) throw new Error("Private directories must not be tracked");
	const mappings = [["posts", "src/content/posts"], ["spec", "src/content/spec"], ["data", "src/data"], ["images", "public/images"], ["overrides", "src/config/overrides"]];
	// Only remove our exact generated directory, never the source repository.
	fs.rmSync(workspace, { recursive: true, force: true });
	fs.mkdirSync(workspace, { recursive: true });
	for (const name of tracked) {
		if (name.startsWith(".env") || mappings.some(([, dest]) => name.startsWith(dest + "/"))) continue;
		const source = path.join(root, name);
		if (!fs.existsSync(source)) continue;
		const dest = path.join(workspace, name);
		fs.mkdirSync(path.dirname(dest), { recursive: true });
		fs.copyFileSync(source, dest);
	}
	for (const [sourceName, destName] of mappings) {
		const source = path.join(content, sourceName);
		const dest = path.join(workspace, destName);
		if (fs.existsSync(source)) fs.cpSync(source, dest, { recursive: true, filter: (entry) => path.basename(entry) !== ".git" });
		else fs.mkdirSync(dest, { recursive: true });
	}
	const modules = path.join(root, "node_modules");
	if (fs.existsSync(modules)) fs.symlinkSync(modules, path.join(workspace, "node_modules"), "junction");
	return workspace;
}

export function syncContent() {
	const supplied = { ...process.env };
	loadEnv();
	Object.assign(process.env, supplied);
	if (process.env.ENABLE_CONTENT_SYNC === "false") return rootDir;
	const content = path.resolve(rootDir, process.env.CONTENT_DIR || "content");
	if (!fs.existsSync(content)) {
		if (!process.env.CONTENT_REPO_URL) return rootDir;
		const relative = path.relative(rootDir, content);
		if (!relative || content === path.join(rootDir, ".content-workspace") || content.startsWith(path.join(rootDir, ".content-workspace") + path.sep)) throw new Error("Invalid content clone destination");
		if (!relative.startsWith("..") && !path.isAbsolute(relative)) {
			execFileSync("git", ["check-ignore", "--quiet", relative.replaceAll(path.sep, "/") + "/privacy-check"], { cwd: rootDir, stdio: "pipe" });
		}
		try { execFileSync("git", ["clone", "--depth", "1", process.env.CONTENT_REPO_URL, content], { stdio: "pipe" }); }
		catch { throw new Error("Content clone failed; check repository access and credentials"); }
	}
	const workspace = prepareWorkspace(rootDir, content);
	console.log("Content prepared in ignored .content-workspace; main repository defaults unchanged.");
	return workspace;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) syncContent();
