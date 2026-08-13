import type { AnnouncementConfig } from "../types/config";

// 公告栏配置
export const announcementConfig: AnnouncementConfig = {
	title: "", // 公告标题，填空使用i18n字符串Key.announcement
	content: "这里没有什么宏大的目标，也不打算把它做成一个多么了不起的地方。只是想给自己留一个安静的小角落，记录一些代码、项目、学习过程，还有那些偶尔冒出来的奇奇怪怪的想法。", // 公告内容
	closable: true, // 允许用户关闭公告
	link: {
		enable: true, // 启用链接
		text: "Learn More", // 链接文本
		url: "/about/", // 链接 URL
		external: false, // 内部链接
	},
};
