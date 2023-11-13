import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";

import { ModalProvider } from "@/providers/modal-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Panel de Administración",
	description: "Panel de administación para tienda en línea.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider localization={esES}>
			<html lang="es">
				<body className={inter.className}>
					<ModalProvider />
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
