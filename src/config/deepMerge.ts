/**
 * 配置覆盖的合并语义
 *
 * 供 src/config/index.ts 把 src/config/overrides/ 下的部分覆盖合并进上游默认
 * 配置。这里刻意不引入任何 Vite 专有语法（如 import.meta.glob），以便直接用
 * node --experimental-strip-types 做单元测试。
 *
 * 合并规则：
 * - 双方都是普通对象 → 递归合并，覆盖值只影响写到的字段；
 * - 其余情况（数组、标量、null）→ 覆盖值整体替换，不做拼接；
 * - 覆盖值中显式写成 undefined 的键 → 跳过，保留默认值。
 *
 * 合并不会修改 base，默认配置对象始终保持原样。
 */
export function deepMerge<T>(base: T, override: unknown): T {
	if (override === undefined) {
		return base;
	}

	if (!isPlainObject(base) || !isPlainObject(override)) {
		return override as T;
	}

	const merged: Record<string, unknown> = { ...base };
	for (const [key, value] of Object.entries(override)) {
		if (value === undefined) {
			continue;
		}
		merged[key] = deepMerge(merged[key], value);
	}

	return merged as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (typeof value !== "object" || value === null) {
		return false;
	}
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}
