"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
	name: z.string().min(1, { message: "El nombre de la tienda es obligatorio" }),
});

const StoreModal = () => {
	const storeModal = useStoreModal();

	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setLoading(true);

			// throw new Error("x");

			const response = await axios.post("/api/stores", values);

			toast.success("Tienda creada.");
		} catch (error) {
			toast.error("Algo salió mal.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			title="Crear tienda"
			description="Crear una nueva tienda para administrar sus propios productos y categorías"
			isOpen={storeModal.isOpen}
			onClose={storeModal.onClose}
		>
			<div className="space-y-4 py-2 pb-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Nombre de la tienda"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="pt-6 space-x-2 flex items-center justify-end w-full">
							<Button
								disabled={loading}
								variant="outline"
								onClick={storeModal.onClose}
							>
								Cancelar
							</Button>
							<Button
								disabled={loading}
								type="submit"
							>
								Continuar
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</Modal>
	);
};
export default StoreModal;
