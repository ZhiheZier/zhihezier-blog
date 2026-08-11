/**
 * Fancybox 语言包加载助手
 * 根据站点或页面语言代码，规范化并动态加载对应的 Fancybox 语言包
 */

export type FancyboxL10n = Record<string, any>;

/**
 * 规范化语言代码为 Fancybox 6 语言包文件名格式
 */
export function normalizeLangCode(lang: string | null | undefined): string | null {
	if (!lang) return null;
	const normalized = lang.trim().replace(/-/g, "_");
	const lower = normalized.toLowerCase();

	if (lower.startsWith("zh")) {
		return "zh_CN";
	}
	if (lower.startsWith("de")) {
		return "de_DE";
	}
	if (lower.startsWith("es")) {
		return "es_ES";
	}
	if (lower.startsWith("fr")) {
		return "fr_FR";
	}
	if (lower.startsWith("it")) {
		return "it_IT";
	}
	if (lower.startsWith("lv")) {
		return "lv_LV";
	}
	if (lower.startsWith("tr")) {
		return "tr_TR";
	}
	if (lower.startsWith("uk")) {
		return "uk_UA";
	}
	if (lower.startsWith("en")) {
		return null; // Fancybox 默认界面语言即为英文
	}
	return normalized;
}

// 显式声明静态分析导入，确保 Vite 构建打包时将语言包单独打包为生产环境可调用的 JS Chunk
const l10nLoaders: Record<string, () => Promise<any>> = {
	zh_CN: () => import("@fancyapps/ui/dist/fancybox/l10n/zh_CN.js"),
	de_DE: () => import("@fancyapps/ui/dist/fancybox/l10n/de_DE.js"),
	es_ES: () => import("@fancyapps/ui/dist/fancybox/l10n/es_ES.js"),
	fr_FR: () => import("@fancyapps/ui/dist/fancybox/l10n/fr_FR.js"),
	it_IT: () => import("@fancyapps/ui/dist/fancybox/l10n/it_IT.js"),
	lv_LV: () => import("@fancyapps/ui/dist/fancybox/l10n/lv_LV.js"),
	tr_TR: () => import("@fancyapps/ui/dist/fancybox/l10n/tr_TR.js"),
	uk_UA: () => import("@fancyapps/ui/dist/fancybox/l10n/uk_UA.js"),
};

/**
 * 动态加载对应的 Fancybox 语言包
 */
export async function loadFancyboxL10n(
	lang?: string,
): Promise<FancyboxL10n | null> {
	const targetLang =
		lang || (typeof document !== "undefined" ? document.documentElement.lang : "");
	const langCode = normalizeLangCode(targetLang);

	if (!langCode || !l10nLoaders[langCode]) {
		return null;
	}

	try {
		const l10nModule = await l10nLoaders[langCode]();
		return l10nModule.default || l10nModule[langCode] || l10nModule;
	} catch {
		// 当对应语言包未提供或动态导入失败时，安全回退到默认英文
		return null;
	}
}
