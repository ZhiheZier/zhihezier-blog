import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { prepareWorkspace } from "../scripts/sync-content.js";

test("private content stays outside tracked defaults and staging", () => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "blog-isolation-"));
	const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" });
	const write = (name, data) => {
		const target = path.join(root, name);
		fs.mkdirSync(path.dirname(target), { recursive: true });
		fs.writeFileSync(target, data);
	};
	try {
		git("init", "--quiet");
		write(".gitignore", "/content/\n/.content-workspace/\n/node_modules/\n");
		write("src/data/projects.ts", "DEFAULT");
		write("src/content/posts/default.md", "DEFAULT ARTICLE");
		write("package.json", "{}");
		git("add", ".");
		const beforeIndex = git("ls-files", "--stage");
		write("content/data/projects.ts", "PRIVATE");
		write("content/posts/private.md", "PRIVATE ARTICLE");
		write("content/.git/private-marker", "PRIVATE GIT METADATA");
		const workspace = prepareWorkspace(root, path.join(root, "content"));
		assert.equal(fs.readFileSync(path.join(root, "src/data/projects.ts"), "utf8"), "DEFAULT");
		assert.equal(fs.readFileSync(path.join(root, "content/data/projects.ts"), "utf8"), "PRIVATE");
		assert.equal(fs.readFileSync(path.join(workspace, "src/data/projects.ts"), "utf8"), "PRIVATE");
		assert.equal(fs.existsSync(path.join(workspace, "src/content/posts/default.md")), false);
		assert.equal(fs.existsSync(path.join(workspace, ".git")), false);
		git("add", ".");
		assert.equal(git("ls-files", "--stage"), beforeIndex);
		write(".content-workspace/src/content/posts/stale.md", "STALE");
		prepareWorkspace(root, path.join(root, "content"));
		assert.equal(fs.existsSync(path.join(workspace, "src/content/posts/stale.md")), false);
		assert.equal(fs.readFileSync(path.join(root, "content/posts/private.md"), "utf8"), "PRIVATE ARTICLE");
		assert.equal(git("ls-files", "--stage"), beforeIndex);
		write(".gitignore", "/content/\n");
		assert.throws(() => prepareWorkspace(root, path.join(root, "content")));
	} finally {
		fs.rmSync(root, { recursive: true, force: true });
	}
});
