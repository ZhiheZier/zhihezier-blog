import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { deepMerge } from "../src/config/deepMerge.ts";

describe("config override merge", () => {
	it("只覆盖写到的字段，其余取默认值", () => {
		const base = {
			themeColor: { hue: 240, fixed: false },
			banner: { position: "center", carousel: { enable: true, interval: 3 } },
		};

		const merged = deepMerge(base, {
			banner: { carousel: { interval: 8 } },
		});

		assert.deepEqual(merged, {
			themeColor: { hue: 240, fixed: false },
			banner: { position: "center", carousel: { enable: true, interval: 8 } },
		});
	});

	it("数组整体替换而不是拼接", () => {
		const base = { src: { desktop: ["1.webp", "2.webp", "3.webp"] } };

		const merged = deepMerge(base, { src: { desktop: ["only.webp"] } });

		assert.deepEqual(merged.src.desktop, ["only.webp"]);
	});

	it("跳过覆盖值中显式写成 undefined 的键", () => {
		const merged = deepMerge({ title: "Mizuki" }, { title: undefined });

		assert.equal(merged.title, "Mizuki");
	});

	it("覆盖值为 null 时按整体替换处理", () => {
		const merged = deepMerge(
			{ credit: { url: "https://example.com/" } },
			{
				credit: { url: null },
			},
		);

		assert.equal(merged.credit.url, null);
	});

	it("覆盖缺失时原样返回默认配置", () => {
		const base = { title: "Mizuki" };

		assert.equal(deepMerge(base, undefined), base);
	});

	it("不修改默认配置对象", () => {
		const base = { themeColor: { hue: 240, fixed: false } };

		deepMerge(base, { themeColor: { hue: 30 } });

		assert.equal(base.themeColor.hue, 240);
	});

	it("默认值里不存在的键会被补上", () => {
		const merged = deepMerge<{ keywords?: string[] }>(
			{},
			{
				keywords: ["blog"],
			},
		);

		assert.deepEqual(merged.keywords, ["blog"]);
	});
});
