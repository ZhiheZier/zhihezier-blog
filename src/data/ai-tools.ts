export type AIToolCategory =
	| "chat"
	| "coding"
	| "image"
	| "audio"
	| "video"
	| "writing"
	| "search"
	| "other";

export type AIToolFrequency =
	| "daily"
	| "weekly"
	| "occasional"
	| "experimental";

export type LocaleString = Partial<
	Record<"en" | "zh_CN" | "zh_TW" | "ja", string>
>;

export function getLocaleString(value: LocaleString, lang: string): string {
	return value[lang as keyof LocaleString] ?? value["en"] ?? "";
}

export interface AITool {
	id: string;
	name: string;
	description: LocaleString;
	icon: string;
	category: AIToolCategory;
	frequency: AIToolFrequency;
	url?: string;
	usage?: LocaleString;
	tags?: string[];
	color?: string;
}

// Replace the examples below with your own AI tools
export const aiToolsData: AITool[] = [
	{
		id: "cursor",
		name: "Cursor",
		description: {
			en: "AI-powered code editor with intelligent code completion.",
			zh_CN: "AI 驱动的代码编辑器，智能补全与对话式编程。",
		},
		icon: "material-symbols:code",
		category: "coding",
		frequency: "daily",
		url: "https://cursor.com",
		usage: {
			en: "Daily: coding, refactoring",
			zh_CN: "每天：写代码、重构",
		},
		tags: ["Coding", "Editor", "AI"],
		color: "#000000",
	},
	{
		id: "pi-web",
		name: "Pi Web",
		description: {
			en: "Web UI for the pi coding agent.",
			zh_CN: "Pi 编程代理的 Web 界面。",
		},
		icon: "material-symbols:terminal",
		category: "coding",
		frequency: "daily",
		url: "https://github.com/agegr/pi-web",
		usage: {
			en: "Daily: autonomous coding tasks",
			zh_CN: "每天：自动化编码任务",
		},
		tags: ["Coding", "Agent", "Web UI"],
		color: "#8B5CF6",
	},
];
