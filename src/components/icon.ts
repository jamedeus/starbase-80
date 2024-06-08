import { is } from "../shared/is";
import { IconAspect } from "../shared/types";
import { Anchor } from "./anchor";

const iconColors = [
	"blue",
	"rose",
	"green",
	"red",
	"yellow",
	"cyan",
	"pink",
	"orange",
	"sky",
	"slate",
	"emerald",
	"zinc",
	"neutral",
	"amber",
	"violet",
];
const iconLevel = 300;

const getIconColor = (index: number) => `bg-${iconColors[iconColors.length % index]}-${iconLevel}`;

interface IProps {
	name: string;
	index: number;
	icon?: string;
	iconColor?: string;
	iconBG?: string;
	iconBubble?: boolean;
	iconAspect?: IconAspect;
	uri?: string;
	newWindow?: boolean;
}

export const Icon = function (props: IProps): string {
	const { name, uri, icon, index, iconBG, iconBubble, iconColor, iconAspect, newWindow } = props;

	if (is.null(icon)) {
		if (!is.null(uri)) {
			return Anchor({ uri: uri as string, title: name, newWindow, children: IconBlank({ index }) });
		}

		return IconBlank({ index });
	}

	return IconBase({
		icon: icon as string,
		iconBG,
		iconColor,
		iconBubble,
		iconAspect,
	});
};

interface IIconBlankProps {
	index: number;
}

function IconBlank(props: IIconBlankProps) {
	const { index } = props;
	return `
		<span
			class="${`block w-16 h-16 rounded-2xl border border-black/5 shadow-sm ${getIconColor(index)} overflow-hidden`}"
		/>
	`;
}

enum IconType {
	uri,
	material,
	dashboard,
}

interface IIconBaseProps {
	icon: string;
	iconColor?: string;
	iconBG?: string;
	iconBubble?: boolean;
	iconAspect?: IconAspect;
}

function IconBase(props: IIconBaseProps) {
	let { icon, iconBG, iconBubble, iconColor, iconAspect = "square" } = props;

	let iconType: IconType = IconType.uri;

	if (icon.startsWith("http") || icon.startsWith("/")) {
		iconType = IconType.uri;
	} else if (icon.startsWith("mdi-")) {
		iconType = IconType.material;
	} else {
		iconType = IconType.dashboard;
	}

	// Everyone starts the same size
	let iconClassName = "block overflow-hidden bg-contain object-contain";
	let iconWidthHeightClassName = "";

	switch (iconAspect) {
		case "width":
			iconWidthHeightClassName = "w-16";
			break;
		case "height":
			iconWidthHeightClassName = "h-16";
			break;
		case "square":
		default:
			iconWidthHeightClassName = "w-16 h-16";
			break;
	}

	iconClassName += " " + iconWidthHeightClassName;

	if (is.null(iconBubble) || iconBubble !== false) {
		iconClassName += " rounded-2xl border border-black/5 shadow-sm";
	}

	const iconStyle: string[] = [];

	switch (iconType) {
		case IconType.uri:
		case IconType.dashboard:
			// Default to bubble and no background for URI and Dashboard icons
			if (!is.null(iconBG)) {
				if (iconBG?.startsWith("#")) {
					iconStyle.push(`background-color: ${iconBG}`);
				} else {
					iconClassName += ` bg-${iconBG}`;
				}
			}
			break;
		case IconType.material:
			// Material icons get a color and a background by default, then an optional bubble
			if (is.null(iconBG)) {
				iconClassName += ` bg-slate-200 dark:bg-gray-900`;
			} else {
				if (iconBG?.startsWith("#")) {
					iconStyle.push(`background-color: ${iconBG}`);
				} else {
					iconClassName += ` bg-${iconBG}`;
				}
			}

			if (is.null(iconColor)) {
				iconColor = "black dark:bg-white";
			}
			break;
	}

	const mdiIconStyle: string[] = [];
	let mdiIconColorFull = "bg-" + iconColor;

	if (!is.null(iconColor) && iconColor?.startsWith("#")) {
		mdiIconColorFull = "";
		mdiIconStyle.push(`background-color: ${iconColor}`);
	}

	switch (iconType) {
		case IconType.uri:
			return `<span class="flex items-center ${iconWidthHeightClassName}"><img src="${icon}" alt="" class="${
				iconClassName || ""
			}" style="${unwrapStyles(iconStyle)}" /></span>`;
		case IconType.dashboard:
			icon = icon.replace(".png", "").replace(".jpg", "").replace(".svg", "");
			return `
				<img
					src=${`https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/${icon}.png`}
					alt=""
					class="${iconClassName || ""}"
					style="${unwrapStyles(iconStyle)}"
				/>
			`;
		case IconType.material:
			icon = icon.replace("mdi-", "").replace(".svg", "");

			return `
				<span class="relative ${iconClassName || ""}" style="${unwrapStyles(iconStyle)}">
					<span
						class="absolute block ${mdiIconColorFull} h-full w-full overflow-hidden"
						style="${unwrapStyles(
							mdiIconStyle.concat([
								`mask: url(https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/${icon}.svg) no-repeat center / contain`,
								`webkit-mask: url(https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/${icon}.svg) no-repeat center / contain`,
							])
						)}"
					></span>
				</span>
			`;
	}
}

function unwrapStyles(styles: string[]): string {
	if (is.null(styles)) {
		return "";
	}

	return styles.join(";");
}
