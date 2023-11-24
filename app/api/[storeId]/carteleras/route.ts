import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const { label, imageUrl } = body;

		if (!userId) {
			return new NextResponse("Inicia sesión primero", { status: 401 });
		}

		if (!label) {
			return new NextResponse("El nombre es requerido", { status: 400 });
		}

		if (!imageUrl) {
			return new NextResponse("La imagen es requerida", { status: 400 });
		}

		console.log(params.storeId);
		if (!params.storeId) {
			return new NextResponse("El ID de la tienda es requerido", {
				status: 400,
			});
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse("No tienes permiso para modificar esta tienda", {
				status: 403,
			});
		}

		const billboard = await prismadb.billboard.create({
			data: {
				label,
				imageUrl,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.log("[BILLBOARDS_POST]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storedId: string } }
) {
	try {
		if (!params.storedId) {
			return new NextResponse("El ID de la tienda es requerido", {
				status: 400,
			});
		}

		const billboards = await prismadb.billboard.findMany({
			where: {
				storeId: params.storedId,
			},
		});

		return NextResponse.json(billboards);
	} catch (error) {
		console.log("[BILLBOARDS_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
