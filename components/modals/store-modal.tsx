"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";

const StoreModal = () => {
	const storeModal = useStoreModal();

	return (
		<Modal
			title="Crear tienda"
			description="Crear una nueva tienda para administrar sus propios productos y categorías"
			isOpen={storeModal.isOpen}
			onClose={storeModal.onClose}
		>
			Future Create Store Form
		</Modal>
	);
};
export default StoreModal;
