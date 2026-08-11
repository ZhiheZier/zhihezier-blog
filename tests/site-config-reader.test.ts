import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { extractBlock, matchInBlock } from "../scripts/read-site-config.mjs";

// 上游默认配置的缩影：字段齐全，块顺序固定
const DEFAULTS = `
export const siteConfig: SiteConfig = {
	navbarTitle: { mode: "text-icon", text: "MizukiUI" },
	font: { mode: "custom" },
	bangumi: { userId: "your-bangumi-id", fetchOnDev: false },
	bilibili: { vmid: "", coverMirror: "", useWebp: true },
	anime: { mode: "local" },
};
`;

const MODE = /mode:\s*["']([^"']+)["']/;
const VMID = /vmid:\s*["']([^"']*)["']/;
const COVER_MIRROR = /coverMirror:\s*["']([^"']*)["']/;
const USE_WEBP = /useWebp:\s*(true|false)/;

describe("Node 脚本读取站点配置", () => {
	it("没有覆盖文件时读上游默认值", () => {
		assert.equal(matchInBlock([DEFAULTS], "anime", MODE), "local");
		assert.equal(matchInBlock([DEFAULTS], "bilibili", USE_WEBP), "true");
	});

	it("覆盖文件优先于默认值", () => {
		const override = `export default { anime: { mode: "bilibili" } };`;

		assert.equal(matchInBlock([override, DEFAULTS], "anime", MODE), "bilibili");
	});

	it("覆盖块里缺少的字段继续回退到默认值", () => {
		// 只覆盖 vmid，coverMirror / useWebp 仍应取上游默认
		const override = `export default { bilibili: { vmid: "1129280784" } };`;
		const sources = [override, DEFAULTS];

		assert.equal(matchInBlock(sources, "bilibili", VMID), "1129280784");
		assert.equal(matchInBlock(sources, "bilibili", COVER_MIRROR), "");
		assert.equal(matchInBlock(sources, "bilibili", USE_WEBP), "true");
	});

	it("取值不会越过块边界串到相邻配置", () => {
		// anime 块是空的，后面 font.mode 不能被当成番剧模式
		const override = `export default {
			anime: {},
			font: { mode: "system" },
		};`;

		assert.equal(matchInBlock([override, DEFAULTS], "anime", MODE), "local");
	});

	it("覆盖文件里不存在的块直接跳过", () => {
		const override = `export default { title: "我的站点" };`;

		assert.equal(matchInBlock([override, DEFAULTS], "anime", MODE), "local");
	});

	it("所有来源都没有该块时返回 null，由调用方兜底", () => {
		assert.equal(matchInBlock([DEFAULTS], "notAConfigBlock", MODE), null);
	});

	it("块内嵌套对象不会提前截断", () => {
		const content = `{
			banner: { src: { desktop: ["a"] }, position: "center" },
			anime: { mode: "bangumi" },
		}`;

		const banner = extractBlock(content, "banner");
		assert.match(banner, /position:\s*"center"/);
		assert.equal(matchInBlock([content], "anime", MODE), "bangumi");
	});

	it("花括号不配平时视为没有该块", () => {
		assert.equal(extractBlock(`anime: { mode: "local"`, "anime"), null);
	});
});
