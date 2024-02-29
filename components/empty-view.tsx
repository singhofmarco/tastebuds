'use client'

import Image from 'next/image'
import AddRecipeButton from './add-recipe-button'
import { Button } from '@nextui-org/button'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'
import { useState } from 'react'

export default function EmptyView() {
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilter] = useQueryStates(
    {
      query: parseAsString,
      cuisineTypes: parseAsArrayOf(parseAsString),
    },
    {
      shallow: false,
    }
  )

  const filtersApplied = filters.query || filters.cuisineTypes

  function handleRemoveFilters() {
    setIsLoading(true)
    setFilter({
      query: null,
      cuisineTypes: null,
    })
  }

  return (
    <div className="my-12 flex flex-col gap-4 justify-center items-center h-full text-center">
      <Image
        src="/logo.svg"
        alt="Tastebuds AI"
        width={680}
        height={823}
        className="w-24 h-24"
      />
      <p className="text-default-400">No recipes found.</p>

      {filtersApplied || isLoading ? (
        <Button
          variant="shadow"
          color="secondary"
          onPress={handleRemoveFilters}
          disabled={isLoading}
        >
          Remove filters
        </Button>
      ) : (
        <AddRecipeButton size="lg">Create a new recipe</AddRecipeButton>
      )}
    </div>
  )
}
