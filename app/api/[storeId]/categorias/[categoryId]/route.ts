import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
	_req: Request, // No se usa pero params debe ser el segundo argumento
	{ params }: { params: { categoryId: string } }
) {
	try {
		if (!params.categoryId) {
			return new NextResponse("El ID de la categoría es requerido", {
				status: 400,
			});
		}

		const category = await prismadb.category.findUnique({
			where: {
				id: params.categoryId,
			},
			include: {
				billboard: true,
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();

		const { name, billboardId } = body;

		if (!userId) {
			return new NextResponse("No autenticado", { status: 401 });
		}

		if (!name) {
			return new NextResponse("El nombre de la categoría es requerido", {
				status: 400,
			});
		}

		if (!billboardId) {
			return new NextResponse("La cartelera es requerida", { status: 400 });
		}

		if (!params.categoryId) {
			return new NextResponse("El ID de la categoría es requerido", {
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
			return new NextResponse("No autorizado", {
				status: 403,
			});
		}

		const category = await prismadb.category.updateMany({
			where: {
				id: params.categoryId,
			},
			data: {
				name,
				billboardId,
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function DELETE(
	_req: Request, // No se usa pero params debe ser el segundo argumento
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("No autenticado", { status: 401 });
		}

		if (!params.categoryId) {
			return new NextResponse("El ID de la categoría es requerido", {
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
			return new NextResponse("No autorizado", {
				status: 403,
			});
		}

		const category = await prismadb.category.deleteMany({
			where: {
				id: params.categoryId,
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
