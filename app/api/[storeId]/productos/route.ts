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
		const {
			name,
			price,
			categoryId,
			sizeId,
			colorId,
			images,
			isFeatured,
			isArchived,
		} = body;

		if (!userId) {
			return new NextResponse("No autenticado", { status: 401 });
		}

		if (!name) {
			return new NextResponse("El nombre del producto es requerido", {
				status: 400,
			});
		}

		if (!price) {
			return new NextResponse("El precio del producto es requerido", {
				status: 400,
			});
		}

		if (!categoryId) {
			return new NextResponse("La categoría del producto es requerida", {
				status: 400,
			});
		}

		if (!sizeId) {
			return new NextResponse("La talla del producto es requerida", {
				status: 400,
			});
		}

		if (!colorId) {
			return new NextResponse("El color del producto es requerido", {
				status: 400,
			});
		}

		if (!images || !images.length) {
			return new NextResponse("La imagen del producto es requerida", {
				status: 400,
			});
		}

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
			return new NextResponse("No autorizado", {
				status: 403,
			});
		}

		const product = await prismadb.product.create({
			data: {
				name,
				price,
				categoryId,
				sizeId,
				colorId,
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
				isFeatured,
				isArchived,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCTS_POST]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { searchParams } = new URL(req.url);
		const categoryId = searchParams.get("categoryId") || undefined;
		const sizeId = searchParams.get("sizeId") || undefined;
		const colorId = searchParams.get("colorId") || undefined;
		const isFeatured = searchParams.get("isFeatured");

		if (!params.storeId) {
			return new NextResponse("El ID de la tienda es requerido", {
				status: 400,
			});
		}

		const products = await prismadb.product.findMany({
			where: {
				storeId: params.storeId,
				categoryId,
				sizeId,
				colorId,
				isFeatured: isFeatured ? true : undefined,
				isArchived: false,
			},
			include: {
				category: true,
				size: true,
				color: true,
				images: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(products);
	} catch (error) {
		console.log("[PRODUCTS_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
