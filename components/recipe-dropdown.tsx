'use client'

import { Button } from '@nextui-org/button'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/dropdown'
import { deleteRecipe } from '@/app/actions'
import clsx from 'clsx'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid'

export default function RecipeDropdown({
  recipeId,
  className,
}: {
  recipeId: number
  className?: string
}) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className={clsx(className, 'flex flex-shrink-0 items-center gap-2')}
          color="secondary"
          variant="light"
          size="sm"
        >
          <EllipsisHorizontalIcon className="w-6 h-6" aria-label="Actions" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Actions">
        <DropdownItem
          key="delete"
          className="text-danger"
          color="danger"
          variant="solid"
          onClick={async () => {
            await deleteRecipe(recipeId).catch(() => {
              alert('Unable to delete recipe.')
            })
          }}
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
