import { Header } from "../components/header";
import { ServiceCatalogList } from "../components/service-catalogs";
import userServicesOld from "../config.json";
import userServices from "../config/config.json";
import { is } from "../shared/is";
import { IServiceCategory } from "../shared/types";
import { SHOWHEADER, SHOWHEADERLINE, SHOWHEADERTOP } from "../variables";

interface IProps {
	title?: string;
	icon?: string;
}

export const IndexPage = function (props: IProps): string {
	const { icon, title } = props;
	const myServices = (is.null(userServicesOld) ? userServices : userServicesOld) as IServiceCategory[];

	let headerClassName = "p-4";

	if (SHOWHEADERTOP) {
		headerClassName += " w-full";
	} else {
		headerClassName += " w-full xl:w-auto xl:max-w-xs xl:min-h-screen";
	}

	if (SHOWHEADERLINE) {
		headerClassName += "border-0 border-solid border-gray-300 dark:border-gray-700";

		if (SHOWHEADERTOP) {
			headerClassName += " border-b";
		} else {
			headerClassName += " border-b xl:border-r xl:border-b-0";
		}
	}

	let pageWrapperClassName = "min-h-screen flex flex-col  max-w-screen-2xl mx-auto";

	if (!SHOWHEADERTOP) {
		pageWrapperClassName += " xl:flex-row";
	}

	let serviceCatalogListWrapperClassName = "p-4 flex-grow";

	if (!SHOWHEADERTOP) {
		serviceCatalogListWrapperClassName += " min-h-screen";
	}

	return `
		<div class="min-h-screen">
			<div class="${pageWrapperClassName}">
				${
					SHOWHEADER
						? `
					<div class="${headerClassName}">
					${Header({ icon, title })}
					</div>
				`
						: ``
				}
				<div class="${serviceCatalogListWrapperClassName}">
				${ServiceCatalogList({ categories: myServices })}
				</div>
			</div>
		</div>
	`;
};
