"use client";

import { Trash2 } from "lucide-react";
import { Size } from "@prisma/client";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

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
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
	name: z.string().min(1, { message: "El nombre de la talla es obligatorio" }),
	value: z.string().min(1, { message: "El tamaño de la talla es requerido." }),
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
	initialData: Size | null;
}

export const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? "Editar talla" : "Crear talla";
	const description = initialData ? "Editar la talla" : "Crear una nueva talla";
	const toastMessage = initialData ? "Talla actualizada." : "Talla creada.";
	const action = initialData ? "Guardar" : "Crear";

	const form = useForm<SizeFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: "",
			value: "",
		},
	});

	const onSubmit = async (data: SizeFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/tallas/${params.sizeId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/tallas`, data);
			}
			router.push(`/${params.storeId}/tallas`);
			router.refresh();
			toast.success(toastMessage);
		} catch (error) {
			toast.error("Algo salió mal.");
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/tallas/${params.sizeId}`);
			router.push(`/${params.storeId}/tallas`);
			router.refresh();
			toast.success("Talla eliminada.");
		} catch (error) {
			toast.error(
				"Asegúrate de primero eliminar todos los productos que usan esta talla."
			);
		} finally {
			setLoading(false);
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
						<Trash2 className="h-4 w-4" />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Talla</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Nombre de la talla"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="value"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tamaño</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Tamaño de la talla"
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
		</>
	);
};
