import { Menu } from "lucide-react";

import { MainNav } from "@/components/main-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const ResponsiveMenu = () => {
	return (
		<Sheet>
			<SheetTrigger>
				<Menu className="h-6 w-6 lg:hidden" />
			</SheetTrigger>
			<SheetContent side="right">
				<MainNav className="flex flex-col space-y-8 pt-12" />
			</SheetContent>
		</Sheet>
	);
};
export default ResponsiveMenu;
