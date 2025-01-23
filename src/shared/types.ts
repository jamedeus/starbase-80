export interface IServiceCatalog {
	category: string;
	bubble?: boolean;
	bubbleBGLight?: string;
	bubbleBGDark?: string;
	services: IService[];
	iconBubblePadding?: boolean;
}

export interface IService {
	name: string;
	uri: string;

	description?: string;
	icon?: string;
	iconColor?: string;
	iconBG?: string;
	iconBubble?: boolean;
	iconBubblePadding?: boolean;
	iconAspect?: IconAspect;

	newWindow?: boolean;
}

export type IconAspect = "square" | "width" | "height";
