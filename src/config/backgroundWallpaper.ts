import type { FullscreenWallpaperConfig } from "../types/config";

export const fullscreenWallpaperConfig: FullscreenWallpaperConfig = {
	enable: true,
	src: {
		desktop: [
			"/assets/desktop-banner/1.jpg",
			"/assets/desktop-banner/2.jpg",
			"/assets/desktop-banner/3.jpg",
			"/assets/desktop-banner/4.jpg",
			"/assets/desktop-banner/5.jpg",
		], // 桌面横幅图片
		mobile: [
			"/assets/mobile-banner/1.jpg",
			"/assets/mobile-banner/2.jpg",
			"/assets/mobile-banner/3.jpg",
			"/assets/mobile-banner/4.jpg",
			"/assets/mobile-banner/5.jpg",
			"/assets/mobile-banner/6.jpg",
		], // 移动横幅图片
	},
	position: "center",
	carousel: {
		enable: true,
		interval: 5,
	},
	zIndex: -1,
	opacity: 0.8,
	blur: 1,
	switchable: true,
	overlay: {
		opacity: 0.8, // 壁纸不透明度，0-1
		blur: 1.5, // 背景模糊半径（px）
		cardOpacity: 0.8, // 卡片不透明度，0-1
		switchable: {
			opacity: true,
			blur: true,
			cardOpacity: true,
		},
	},
	fullscreen: {
		switchable: {
			opacity: true,
			blur: true,
		},
	},
};
