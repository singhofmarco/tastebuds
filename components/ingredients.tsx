'use client'

import { Ingredient } from '@prisma/client'
import { useState } from 'react'
import { subtitle } from './primitives'
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover'
import { Button } from '@nextui-org/button'
import { Pagination } from '@nextui-org/pagination'
import { BowlIcon } from './icons'

export default function Ingredients({
  ingredients,
  portions: defaultPortions,
}: {
  ingredients: Ingredient[]
  portions: number
}) {
  const [portions, setPortions] = useState(defaultPortions)

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className={subtitle()}>
          Ingredients for {portions} {portions === 1 ? 'portion' : 'portions'}
        </h3>
        <Popover placement="bottom" showArrow={true}>
          <PopoverTrigger>
            <Button
              className="flex-shrink-0"
              size="sm"
              color="secondary"
              variant="ghost"
            >
              <span className="sr-only sm:not-sr-only">Change portions</span>
              <BowlIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <Pagination
                isCompact
                showControls
                total={10}
                initialPage={defaultPortions}
                onChange={(number) => setPortions(number)}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-4">
        <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
          {ingredients.map((ingredient) => (
            <li key={ingredient.id} className="text-gray-400">
              <span className="text-foreground">
                <span className="capitalize">{ingredient.name}</span> (
                {(ingredient.quantity / defaultPortions) * portions +
                  (ingredient.unit ? ' ' + ingredient.unit : '')}
                )
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
