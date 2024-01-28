'use client'

import Image from 'next/image'
import AddRecipeButton from './add-recipe-button'
import { Button } from '@nextui-org/button'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function EmptyView() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const query = searchParams.get('query')
  const cuisineTypes = searchParams.getAll('cuisineTypes')
  const filtersApplied = query || cuisineTypes.length > 0

  function handleRemoveFilters() {
    replace(pathname)
  }

  return (
    <div className="my-12 flex flex-col gap-4 justify-center items-center h-full text-center">
      <Image
        src="/logo.svg"
        alt="Tastebuds"
        width={680}
        height={823}
        className="w-24 h-24"
      />
      <p className="text-default-400">No recipes found.</p>

      {filtersApplied ? (
        <Button
          variant="shadow"
          color="secondary"
          onPress={handleRemoveFilters}
        >
          Remove filters
        </Button>
      ) : (
        <AddRecipeButton size="lg">Create a new recipe</AddRecipeButton>
      )}
    </div>
  )
}
