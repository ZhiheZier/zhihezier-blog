// Skill data configuration file
// Used to manage data for the skill display page

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string; // Iconify icon name
	category: "frontend" | "backend" | "database" | "tools" | "other";
	level: "beginner" | "intermediate" | "advanced" | "expert";
	experience: {
		years: number;
		months: number;
	};
	projects?: string[]; // Related project IDs
	certifications?: string[];
	color?: string; // Skill card theme color
}

export const skillsData: Skill[] = [
	// Frontend Skills
	{
		id: "astro",
		name: "Astro",
		description:
			"内容驱动的静态网站框架，本博客即基于 Astro 构建。",
		icon: "logos:astro-icon",
		category: "frontend",
		level: "intermediate",
		experience: { years: 0, months: 8 },
		projects: ["zhihezier-blog"],
		color: "#FF5D01",
	},
	{
		id: "typescript",
		name: "TypeScript",
		description:
			"类型安全的 JavaScript 超集，提升代码质量与开发效率。",
		icon: "logos:typescript-icon",
		category: "frontend",
		level: "intermediate",
		experience: { years: 0, months: 8 },
		projects: ["zhihezier-blog"],
		color: "#3178C6",
	},
	{
		id: "javascript",
		name: "JavaScript",
		description:
			"现代 JavaScript 开发，包括 ES6+ 语法与异步编程。",
		icon: "logos:javascript",
		category: "frontend",
		level: "intermediate",
		experience: { years: 1, months: 0 },
		color: "#F7DF1E",
	},
	{
		id: "vue",
		name: "Vue.js",
		description:
			"渐进式 JavaScript 框架，易学易用，适合快速开发。",
		icon: "logos:vue",
		category: "frontend",
		level: "advanced",
		experience: { years: 2, months: 0 },
		color: "#4FC08D",
	},
	{
		id: "svelte",
		name: "Svelte",
		description:
			"编译型前端框架，用于博客交互组件开发。",
		icon: "logos:svelte-icon",
		category: "frontend",
		level: "beginner",
		experience: { years: 0, months: 4 },
		projects: ["zhihezier-blog"],
		color: "#FF3E00",
	},
	{
		id: "tailwindcss",
		name: "Tailwind CSS",
		description:
			"实用优先的 CSS 框架，用于快速构建自定义设计。",
		icon: "logos:tailwindcss-icon",
		category: "frontend",
		level: "intermediate",
		experience: { years: 0, months: 8 },
		projects: ["zhihezier-blog"],
		color: "#06B6D4",
	},

	// Backend Skills
	{
		id: "python",
		name: "Python",
		description:
			"Python 脚本开发，用于 AstrBot 插件与自动化工具。",
		icon: "logos:python",
		category: "backend",
		level: "intermediate",
		experience: { years: 1, months: 0 },
		projects: ["astrbot-maimaidx"],
		color: "#3776AB",
	},
	{
		id: "java",
		name: "Java",
		description:
			"Java 开发，面向对象编程与后端应用。",
		icon: "logos:java",
		category: "backend",
		level: "advanced",
		experience: { years: 2, months: 0 },
		color: "#E76F00",
	},
	{
		id: "c",
		name: "C",
		description:
			"C 语言开发，系统级编程与底层实现。",
		icon: "logos:c",
		category: "backend",
		level: "advanced",
		experience: { years: 3, months: 0 },
		color: "#A8B9CC",
	},
	{
		id: "nodejs",
		name: "Node.js",
		description:
			"Node.js 脚本与工具链开发，用于构建自动化。",
		icon: "logos:nodejs-icon",
		category: "backend",
		level: "intermediate",
		experience: { years: 0, months: 8 },
		projects: ["zhihezier-blog"],
		color: "#339933",
	},

	// Tools
	{
		id: "git",
		name: "Git",
		description:
			"版本控制与协作开发，GitHub 工作流。",
		icon: "logos:git-icon",
		category: "tools",
		level: "intermediate",
		experience: { years: 1, months: 0 },
		color: "#F05032",
	},
	{
		id: "vercel",
		name: "Vercel",
		description:
			"前端部署平台，本博客的托管与自动构建。",
		icon: "logos:vercel-icon",
		category: "tools",
		level: "intermediate",
		experience: { years: 0, months: 6 },
		projects: ["zhihezier-blog"],
		color: "#000000",
	},
];
