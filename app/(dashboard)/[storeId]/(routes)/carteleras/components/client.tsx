"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export const BillboardClient = () => {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title="Cartelera (0)"
					description="Gestiona la cartelera de tu tienda"
				/>
				<Button
					onClick={() => router.push(`/${params.storeId}/carteleras/nueva`)}
				>
					<Plus className="mr-2 w-4 h-4" />
					Agregar
				</Button>
			</div>
			<Separator />
		</>
	);
};
