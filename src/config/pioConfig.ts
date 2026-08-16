import type { PioConfig } from "../types/config";

// Pio 看板娘配置
export const pioConfig: PioConfig = {
	enable: true, // 启用看板娘
	models: [
		{
			path: "/pio/models/maimai-salt/maimai-salt.model3.json",
			scale: 1.6, // 缩放比例，调大只显示上半身
			offset: [0, -0.7], // 位置偏移 [x, y]，y 正值上移
		},
	], // 模型配置
	position: "left", // 模型位置
	width: 280, // 默认宽度
	height: 250, // 默认高度
	mode: "draggable", // 默认为可拖拽模式
	hiddenOnMobile: true, // 默认在移动设备上隐藏
	hideAboutMenu: false, // 隐藏内置 About 菜单按钮
	dialog: {
		welcome: "ZhiheZierのサイトへようこそ！", // 欢迎词
		touch: [
			"何してるの？",
			"触らないで！",
			"変態！",
			"いじめないでよ！",
			"NyaNya,ぐるぐる~",
		], // 触摸提示
		home: "ここをクリックしてホームに戻ってね！", // 首页提示
		skin: ["新しい衣装、見たい？", "新しい衣装、似合ってる？"], // 换装提示
		close: "QWQ またね～", // 关闭提示
		link: "https://github.com/ZhiheZier/zhihezier-blog", // 关于链接
	},
	tips: {
		offset: { x: 0, y: 0 }, // 对话气泡偏移（px），y 正值上移
	},
	menus: {
		items: [
			{ icon: "mdi:emoticon-cry-outline", label: "哭哭", action: "expression:哭哭" },
			{ icon: "mdi:emoticon-angry-outline", label: "生气", action: "expression:生气" },
		],
	},
};
