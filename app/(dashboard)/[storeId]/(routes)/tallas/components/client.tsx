"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

import { SizeColumn, columns } from "./columns";

interface SizesClientProps {
	data: SizeColumn[];
}

export const SizesClient: React.FC<SizesClientProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Tallas (${data.length})`}
					description="Gestiona las tallas de tu tienda"
				/>
				<Button onClick={() => router.push(`/${params.storeId}/tallas/nueva`)}>
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
				description="Rutas API para las tallas"
			/>
			<Separator />
			<ApiList
				entityName="tallas"
				entityIdName="tallaId"
			/>
		</>
	);
};
