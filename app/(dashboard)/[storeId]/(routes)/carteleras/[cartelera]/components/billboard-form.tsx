"use client";

import { Trash } from "lucide-react";
import { Billboard } from "@prisma/client";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { useOrigin } from "@/hooks/use-origin";
import { AlertModal } from "@/components/modals/alert-modal";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApiAlert } from "@/components/ui/api-alert";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
	label: z
		.string()
		.min(1, { message: "El nombre de la cartelera es obligatorio" }),
	imageUrl: z
		.string()
		.min(1, { message: "La imagen de la cartelera es requerida." }),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
	initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
	initialData,
}) => {
	const params = useParams();
	const router = useRouter();
	const origin = useOrigin();

	const [open, setOpen] = useState(false);
	const [loading, setLoding] = useState(false);

	const title = initialData ? "Editar cartelera" : "Crear cartelera";
	const description = initialData
		? "Editar la cartelera"
		: "Crear una nueva cartelera";
	const toastMessage = initialData
		? "Cartelera actualizada."
		: "Cartelera creada.";
	const action = initialData ? "Guardar" : "Crear";

	const form = useForm<BillboardFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			label: "",
			imageUrl: "",
		},
	});

	const onSubmit = async (data: BillboardFormValues) => {
		try {
			setLoding(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/carteleras/${params.billboardId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/carteleras`, data);
			}
			router.refresh();
			router.push(`/${params.storeId}/carteleras`);
			toast.success(toastMessage);
		} catch (error) {
			toast.error("Algo salió mal.");
		} finally {
			setLoding(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoding(true);
			await axios.delete(
				`/api/${params.storeId}/carteleras/${params.billboardId}`
			);
			router.refresh();
			router.push("/");
			router.refresh();
			toast.success("Cartelera eliminada.");
		} catch (error) {
			toast.error("Asegúrate de primero eliminar todas las categorías.");
		} finally {
			setLoding(false);
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className="flex items-center justify-between">
				<Heading
					title={title}
					description={description}
				/>
				{initialData && (
					<Button
						disabled={loading}
						variant="destructive"
						size="icon"
						onClick={() => setOpen(true)}
					>
						<Trash className="h-4 w-4" />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					<FormField
						control={form.control}
						name="imageUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Imagen de fondo</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										disabled={loading}
										onChange={(url) => field.onChange(url)}
										onRemove={() => field.onChange("")}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="label"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Nombre de la cartelera"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button
						disabled={loading}
						className="ml-auto"
						type="submit"
					>
						{action}
					</Button>
				</form>
			</Form>
			<Separator />
		</>
	);
};
