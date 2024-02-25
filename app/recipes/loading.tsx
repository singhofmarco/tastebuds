import { subtitle, title } from '@/components/primitives'
import { RecipeSearch } from '@/components/recipe-search'
import { Spinner } from '@nextui-org/spinner'
import { Suspense } from 'react'

export default function Loading() {
  return (
    <div className="px-4 sm:px-8 flex flex-col gap-y-4">
      <div className="mb-4 flex justify-between">
        <div>
          <h1 className={title()}>Recipes</h1>
          <h2 className={subtitle()}>Loading your recipes...</h2>
        </div>
      </div>
      <Suspense>
        <RecipeSearch disabled />
      </Suspense>

      <Spinner className="mt-8" />
    </div>
  )
}
