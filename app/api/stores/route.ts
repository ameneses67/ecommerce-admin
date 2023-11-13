import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		// Autenticar con Clerk, por lo que me regreso a instalar clerk
	} catch (error) {
		console.log("[STORES_POST]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
