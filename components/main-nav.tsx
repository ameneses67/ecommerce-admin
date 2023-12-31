"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function MainNav({
	className,
	...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
	const pathname = usePathname();
	const params = useParams();

	const routes = [
		{
			href: `/${params.storeId}`,
			label: "Panel",
			active: pathname === `/${params.storeId}`,
		},
		{
			href: `/${params.storeId}/carteleras`,
			label: "Carteleras",
			active: pathname === `/${params.storeId}/carteleras`,
		},
		{
			href: `/${params.storeId}/categorias`,
			label: "Categorias",
			active: pathname === `/${params.storeId}/categorias`,
		},
		{
			href: `/${params.storeId}/tallas`,
			label: "Tallas",
			active: pathname === `/${params.storeId}/tallas`,
		},
		{
			href: `/${params.storeId}/colores`,
			label: "Colores",
			active: pathname === `/${params.storeId}/colores`,
		},
		{
			href: `/${params.storeId}/productos`,
			label: "Productos",
			active: pathname === `/${params.storeId}/productos`,
		},
		{
			href: `/${params.storeId}/ordenes`,
			label: "Ordenes",
			active: pathname === `/${params.storeId}/ordenes`,
		},
		{
			href: `/${params.storeId}/configuracion`,
			label: "Configuración",
			active: pathname === `/${params.storeId}/configuracion`,
		},
	];

	return (
		<nav className={cn("lg:flex items-center lg:space-x-6 hidden", className)}>
			{routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					className={cn(
						"text-2xl lg:text-sm font-medium transition-colors hover:text-primary",
						route.active
							? "text-black dark:text-white"
							: "text-muted-foreground"
					)}
				>
					{route.label}
				</Link>
			))}
		</nav>
	);
}
