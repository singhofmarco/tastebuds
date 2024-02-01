'use client'

import { Input } from '@nextui-org/input'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Chip } from '@nextui-org/chip'
import { ScrollShadow } from '@nextui-org/scroll-shadow'
import { useEffect, useState, useTransition } from 'react'
import { Spinner } from '@nextui-org/spinner'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

export const RecipeSearch = ({
  cuisineTypes,
  disabled,
}: {
  cuisineTypes?: string[]
  disabled?: boolean
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState<string>(searchParams.get('query') || '')
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()
  const [cuisineTypesToFilter, setCuisineTypesToFilter] = useState<string[]>(
    searchParams.get('cuisineTypes')?.split(',') || []
  )

  function handleQueryChange(query: string) {
    setQuery(query)
    updateQuery(query)
  }

  const updateQuery = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(window.location.search)
    if (!query.length) {
      params.delete('query')
    } else {
      params.set('query', query)
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }, 300)

  // update filters when query params change
  useEffect(() => {
    const query = searchParams.get('query') ?? ''
    const cuisineTypes = searchParams.get('cuisineTypes')?.split(',') ?? []
    setQuery(query)
    setCuisineTypesToFilter(cuisineTypes)
  }, [searchParams])

  function createCuisineTypeParam(cuisineTypes: string[]) {
    const params = new URLSearchParams(window.location.search)
    if (cuisineTypes.length === 1) {
      params.set('cuisineTypes', cuisineTypes[0])
    } else if (cuisineTypes.length > 1) {
      params.set('cuisineTypes', cuisineTypes.join(','))
    } else {
      params.delete('cuisineTypes')
    }
    return params.toString()
  }

  function toggleCuisineType(cuisineType: string) {
    let newCuisineTypesFilter: string[] = []
    if (cuisineTypesToFilter.includes(cuisineType)) {
      newCuisineTypesFilter = cuisineTypesToFilter.filter(
        (ct: string) => ct !== cuisineType
      )
    } else {
      newCuisineTypesFilter = [...cuisineTypesToFilter, cuisineType]
    }

    setCuisineTypesToFilter(newCuisineTypesFilter)

    const params = createCuisineTypeParam(newCuisineTypesFilter)
    startTransition(() => {
      replace(`${pathname}?${params}`)
    })
  }

  return (
    <>
      <div className="flex flex-col flex-1 gap-4">
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
              <div className="relative w-5 h-5 flex items-center justify-center">
                <Spinner size="sm" className="pr-1 absolute" color="current" />
              </div>
            ) : (
              <MagnifyingGlassIcon className="w-5 h-5 pr-1 text-base text-default-400 pointer-events-none flex-shrink-0" />
            )
          }
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            handleQueryChange(e.target.value)
          }}
        />
        <ScrollShadow
          hideScrollBar
          orientation="horizontal"
          className="flex gap-2 max-w-full"
        >
          {cuisineTypes?.map((cuisineType: string, index: number) => {
            const colorMapForIndex: {
              [key: number]:
                | 'primary'
                | 'success'
                | 'warning'
                | 'danger'
                | 'secondary'
            } = {
              0: 'primary',
              1: 'success',
              2: 'warning',
              3: 'danger',
              4: 'secondary',
            }

            const color =
              colorMapForIndex[index % Object.keys(colorMapForIndex).length]

            const isActive = cuisineTypesToFilter.includes(cuisineType)

            return (
              <Chip
                key={cuisineType}
                aria-label="Cuisine Type"
                color={isActive ? color : 'default'}
                variant={isActive ? 'solid' : 'flat'}
                className="cursor-pointer hover:opacity-80 select-none"
                isCloseable={isActive}
                onClick={() => toggleCuisineType(cuisineType)}
                onClose={
                  isActive
                    ? () => {
                        toggleCuisineType(cuisineType)
                      }
                    : undefined
                }
              >
                {cuisineType}
              </Chip>
            )
          })}
        </ScrollShadow>
      </div>
    </>
  )
}
