"use client"

import AddRecipeModal from "./add-recipe-modal";
import { useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { AiIcon } from "./icons";

export default function AddRecipeButton({ size = "md", children }: { size?: "sm" | "md" | "lg", children?: React.ReactNode}) {
  const {
    isOpen: isAddRecipeModalOpen,
    onOpen: onAddRecipeModalOpen,
    onClose: onAddRecipeModalClose,
  } = useDisclosure()

  return (
    <>
      <Button variant="solid" size={size} radius="sm"
					className="bg-gradient-to-tr from-pink-600 to-yellow-500 text-white"
				 	startContent={<AiIcon size={20} className="flex-shrink-0" />}
          onPress={onAddRecipeModalOpen}
				>
          {children ?? "Create a new recipe"}
      </Button>
      <AddRecipeModal
        isOpen={isAddRecipeModalOpen}
        onClose={onAddRecipeModalClose}
      />
    </>
  );
}
