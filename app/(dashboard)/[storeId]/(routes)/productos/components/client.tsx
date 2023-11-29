"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

import { ProductColumn, columns } from "./columns";

interface ProductClientProps {
	data: ProductColumn[];
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Productos (${data.length})`}
					description="Gestiona los productos de tu tienda"
				/>
				<Button
					onClick={() => router.push(`/${params.storeId}/productos/nueva`)}
				>
					<Plus className="mr-2 w-4 h-4" />
					Agregar
				</Button>
			</div>
			<Separator />
			<DataTable
				columns={columns}
				data={data}
				searchKey="name"
			/>
			<Heading
				title="API"
				description="Rutas API para los productos"
			/>
			<Separator />
			<ApiList
				entityName="productos"
				entityIdName="productoId"
			/>
		</>
	);
};
