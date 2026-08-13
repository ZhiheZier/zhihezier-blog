// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = Record<string, Device[]> & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	OnePlus: [
		{
			name: "OnePlus Ace 3 Edition",
			image: "/images/device/oneplus-ace3.png",
			specs: "骁龙 8 / 16GB + 512GB",
			description:
				"骁龙 8 旗舰芯片，1.5K 东方屏，5500mAh 电池，100W 超级闪充。",
			link: "https://www.oneplus.com/cn/ace-3-edition/specs",
		},
	],
};
