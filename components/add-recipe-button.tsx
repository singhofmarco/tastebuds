'use client'

import AddRecipeModal from './add-recipe-modal'
import { useDisclosure } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { SparklesIcon } from '@heroicons/react/24/solid'

export default function AddRecipeButton({
  startContent,
  size = 'md',
  children,
  onClick,
}: {
  startContent?: React.ReactElement
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
  onClick?: () => void
}) {
  const {
    isOpen: isAddRecipeModalOpen,
    onOpen: onAddRecipeModalOpen,
    onClose: onAddRecipeModalClose,
  } = useDisclosure()

  return (
    <>
      <Button
        variant="shadow"
        size={size}
        radius="md"
        color="primary"
        startContent={startContent ?? <SparklesIcon className="h-5 w-5" />}
        onPress={() => {
          onAddRecipeModalOpen()
          onClick?.()
        }}
      >
        {children ?? 'Generate Recipe'}
      </Button>
      <AddRecipeModal
        isOpen={isAddRecipeModalOpen}
        onClose={onAddRecipeModalClose}
      />
    </>
  )
}
