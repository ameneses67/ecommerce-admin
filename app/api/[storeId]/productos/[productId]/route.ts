import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
	_req: Request, // No se usa pero params debe ser el segundo argumento
	{ params }: { params: { productId: string } }
) {
	try {
		if (!params.productId) {
			return new NextResponse("El ID del producto es requerido", {
				status: 400,
			});
		}

		const product = await prismadb.product.findUnique({
			where: {
				id: params.productId,
			},
			include: {
				category: true,
				size: true,
				color: true,
				images: true,
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCT_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; productId: string } }
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

		if (!params.productId) {
			return new NextResponse("El ID del producto es requerido", {
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

		await prismadb.product.update({
			where: {
				id: params.productId,
			},
			data: {
				name,
				price,
				categoryId,
				sizeId,
				colorId,
				images: {
					deleteMany: {},
				},
				isFeatured,
				isArchived,
			},
		});

		const product = await prismadb.product.update({
			where: {
				id: params.productId,
			},
			data: {
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCT_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function DELETE(
	_req: Request, // No se usa pero params debe ser el segundo argumento
	{ params }: { params: { storeId: string; productId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("No autenticado", { status: 401 });
		}

		if (!params.productId) {
			return new NextResponse("El ID del producto es requerido", {
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

		const product = await prismadb.product.deleteMany({
			where: {
				id: params.productId,
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCT_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
