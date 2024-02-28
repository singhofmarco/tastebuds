'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Chip } from '@nextui-org/chip'
import { ScrollShadow } from '@nextui-org/scroll-shadow'
import { useEffect, useState } from 'react'

export const RecipeCuisineFilter = ({
  cuisineTypes,
  isPending,
  startTransition,
}: {
  cuisineTypes?: string[]
  isPending: boolean
  startTransition: (callback: () => void) => void
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const [cuisineTypesToFilter, setCuisineTypesToFilter] = useState<string[]>(
    searchParams.get('cuisineTypes')?.split(',') || []
  )

  // update filters when query params change
  useEffect(() => {
    const cuisineTypes = searchParams.get('cuisineTypes')?.split(',') ?? []
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
  )
}
