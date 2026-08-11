/**
 * 站点配置取值助手（供 Node 脚本使用）
 *
 * 这些脚本直接由 node 运行，无法 import TypeScript 配置，沿用既有的正则读取
 * 方式。src/config/overrides/siteConfig.ts 由 sync-content 从内容仓库同步而来，
 * 存在时优先命中，读不到再回退 src/config/siteConfig.ts 里的上游默认值。
 *
 * 取值一律限定在指定的顶层配置块内。覆盖文件是部分配置且键序任意，如果沿用
 * 「块名后面第一个字段」的松散匹配，`anime: {}` 后面的 `font: { mode: ... }`
 * 会被误读成番剧模式。这里用花括号配平把搜索范围钉死在块内。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);

const SOURCE_PATHS = [
	path.join(rootDir, "src/config/overrides/siteConfig.ts"),
	path.join(rootDir, "src/config/siteConfig.ts"),
];

let cachedSources = null;

function readSources() {
	if (!cachedSources) {
		cachedSources = SOURCE_PATHS.filter((source) => fs.existsSync(source)).map(
			(source) => fs.readFileSync(source, "utf-8"),
		);
	}
	return cachedSources;
}

/**
 * 截取 `blockKey: { ... }` 的块内文本，块不存在时返回 null。
 */
export function extractBlock(content, blockKey) {
	const opener = content.match(new RegExp(`\\b${blockKey}\\s*:\\s*\\{`));
	if (!opener) {
		return null;
	}

	let index = opener.index + opener[0].length;
	let depth = 1;
	const start = index;

	while (index < content.length && depth > 0) {
		const char = content[index];
		if (char === "{") depth++;
		else if (char === "}") depth--;
		index++;
	}

	return depth === 0 ? content.slice(start, index - 1) : null;
}

/**
 * 在若干份配置文本里按顺序查找 blockKey 块内的字段，返回第一个命中的捕获组。
 *
 * 覆盖文件里存在该块但没写这个字段时，继续往后一份文本找，而不是就地返回
 * 空值，保证未覆盖的字段回退到默认配置。
 */
export function matchInBlock(sources, blockKey, pattern) {
	for (const content of sources) {
		const block = extractBlock(content, blockKey);
		if (block === null) {
			continue;
		}
		const match = block.match(pattern);
		if (match) {
			return match[1];
		}
	}
	return null;
}

/**
 * 按「覆盖 → 默认」的顺序读取 siteConfig 某个块内的字段，都没命中返回 null。
 */
export function matchSiteConfig(blockKey, pattern) {
	return matchInBlock(readSources(), blockKey, pattern);
}
