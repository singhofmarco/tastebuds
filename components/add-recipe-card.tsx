'use client'

import { Card, CardBody, CardFooter } from '@nextui-org/card'
import { PlusIcon } from '@heroicons/react/16/solid'
import AddRecipeModal from './add-recipe-modal'
import { useDisclosure } from '@nextui-org/modal'

export default function AddRecipeCard() {
  const {
    isOpen: isAddRecipeModalOpen,
    onOpen: onAddRecipeModalOpen,
    onClose: onAddRecipeModalClose,
  } = useDisclosure()

  return (
    <>
      <Card
        className="col-span-12 sm:col-span-3 h-[300px] group"
        onPress={onAddRecipeModalOpen}
        isPressable
        isFooterBlurred
      >
        <CardBody className="flex items-center justify-center">
          <PlusIcon className="w-20 h-20 justify-center flex sm:group-hover:scale-110 transition-transform" />
        </CardBody>
        <CardFooter className="z-10 bottom-0 flex-col !items-start">
          <p className="text-tiny text-foreground-500 uppercase font-bold">
            Add
          </p>
          <h4 className="font-medium text-large">New Recipe</h4>
        </CardFooter>
      </Card>
      <AddRecipeModal
        isOpen={isAddRecipeModalOpen}
        onClose={onAddRecipeModalClose}
      />
    </>
  )
}
