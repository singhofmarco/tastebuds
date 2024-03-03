'use client'

import { Chip } from '@nextui-org/chip'
import { ScrollShadow } from '@nextui-org/scroll-shadow'
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs'

export const RecipeCuisineFilter = ({
  cuisineTypes,
  startTransition,
}: {
  cuisineTypes?: string[]
  startTransition: (callback: () => void) => void
}) => {
  const [cuisineTypesToFilter, setCuisineTypesToFilter] = useQueryState(
    'cuisineTypes',
    parseAsArrayOf(parseAsString).withOptions({ startTransition })
  )

  function toggleCuisineType(cuisineType: string) {
    let newCuisineTypesFilter: string[] | null = []
    if (cuisineTypesToFilter && cuisineTypesToFilter.includes(cuisineType)) {
      newCuisineTypesFilter = cuisineTypesToFilter.filter(
        (ct: string) => ct !== cuisineType
      )

      if (newCuisineTypesFilter.length === 0) {
        newCuisineTypesFilter = null
      }
    } else {
      newCuisineTypesFilter = [...(cuisineTypesToFilter ?? []), cuisineType]
    }

    setCuisineTypesToFilter(newCuisineTypesFilter)
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

        const isActive = cuisineTypesToFilter?.includes(cuisineType)

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
