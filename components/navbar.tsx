import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Menu } from "lucide-react";

import prismadb from "@/lib/prismadb";

import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import ResponsiveMenu from "@/components/responsive-menu";

const Navbar = async () => {
	const { userId } = auth();

	if (!userId) {
		redirect("/sign-in");
	}

	const stores = await prismadb.store.findMany({
		where: {
			userId,
		},
	});

	return (
		<div className="border-b">
			<div className="flex h-16 items-center px-4 relative">
				<StoreSwitcher items={stores} />
				<MainNav className="mx-6" />
				<div className="ml-auto flex items-center space-x-4">
					<ThemeToggle />
					<UserButton afterSignOutUrl="/" />
					<ResponsiveMenu />
				</div>
			</div>
		</div>
	);
};
export default Navbar;
