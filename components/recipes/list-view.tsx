import Image from 'next/image'
import { ViewRecipe } from './recipes-view'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { Chip } from '@nextui-org/chip'
import { ClockIcon, GlobeAmericasIcon } from '@heroicons/react/24/outline'

interface ListViewProps {
  recipes: ViewRecipe[]
}

export default function ListView({ recipes }: ListViewProps) {
  return (
    <ul
      role="list"
      className="sm:mx-8 divide-y divide-foreground-50 overflow-hidden bg-background shadow-sm ring-1 ring-foreground-50 sm:rounded-xl"
    >
      {recipes.map((recipe) => (
        <li
          key={recipe.id}
          className="relative flex justify-between gap-x-6 px-4 py-5 active:bg-foreground-50 sm:hover:bg-foreground-50 sm:px-6"
        >
          <div className="flex min-w-0 gap-x-4">
            {recipe.image ? (
              <Image
                className="h-12 w-12 flex-none rounded-md bg-gray-50"
                src={recipe.image}
                width={1024}
                height={1024}
                alt={`Recipe image for ${recipe.title}`}
              />
            ) : (
              <div className="h-12 w-12 flex-none rounded-md bg-foreground-100" />
            )}
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-foreground">
                <Link href={`/recipes/${recipe.id}`}>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {recipe.title}
                </Link>
              </p>
              <div className="-ml-1 flex items-center gap-4 select-none">
                <Chip
                  aria-label="Cuisine Type"
                  variant="light"
                  size="sm"
                  startContent={
                    <GlobeAmericasIcon className="w-4 h-4 text-danger/80 mr-1" />
                  }
                >
                  {recipe.cuisineType}
                </Chip>
                <Chip
                  startContent={
                    <ClockIcon className="w-4 h-4 text-success/80 mr-1" />
                  }
                  variant="light"
                  size="sm"
                >
                  {recipe.totalTime}
                </Chip>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-xs leading-5 text-foreground-500">
                Saved{' '}
                <time dateTime={recipe.createdAtDateTime}>
                  {recipe.createdAt}
                </time>
              </p>
            </div>
            <ChevronRightIcon
              className="h-5 w-5 flex-none text-gray-400"
              aria-hidden="true"
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
