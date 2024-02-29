'use client'

import { Input } from '@nextui-org/input'
import { useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { useTransition } from 'react'
import { Spinner } from '@nextui-org/spinner'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { RecipeCuisineFilter } from './recipe-cuisine-filter'
import { parseAsString, useQueryState } from 'nuqs'

export const RecipeSearch = ({
  cuisineTypes,
  disabled,
}: {
  cuisineTypes?: string[]
  disabled?: boolean
}) => {
  const { refresh } = useRouter()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useQueryState('query', parseAsString)

  const debouncedRefresh = useDebouncedCallback(() => {
    startTransition(() => {
      refresh()
    })
  }, 300)

  return (
    <>
      <div className="px-4 sm:px-8 flex flex-col flex-1 gap-4">
        <Input
          aria-label="Search"
          classNames={{
            inputWrapper: 'bg-default-100 select-none',
            input: 'text-sm',
          }}
          disabled={disabled}
          labelPlacement="outside"
          placeholder="Search..."
          startContent={
            isPending ? (
              <div className="w-5 h-5 flex items-center justify-center">
                <Spinner size="sm" className="pr-1" color="current" />
              </div>
            ) : (
              <MagnifyingGlassIcon className="w-5 h-5 pr-1 text-base text-default-400 pointer-events-none flex-shrink-0" />
            )
          }
          type="search"
          autoComplete="off"
          value={query || ''}
          onValueChange={(value) => {
            setQuery(value.length ? value : null)
            debouncedRefresh()
          }}
        />

        <RecipeCuisineFilter
          cuisineTypes={cuisineTypes}
          startTransition={startTransition}
        />
      </div>
    </>
  )
}
