import { Suspense } from 'react'
import { Skeleton } from '@nextui-org/skeleton'
import { RecipeCard } from '@/components/recipe-card'
import AddRecipeCard from '@/components/add-recipe-card'
import { ViewRecipe } from './recipes-view'

interface GridViewProps {
  recipes: ViewRecipe[]
}

export default function GridView({ recipes }: GridViewProps) {
  return (
    <ul className="px-4 sm:px-8 gap-4 grid grid-cols-12 grid-rows-2">
      {recipes.map((recipe: ViewRecipe) => (
        <Suspense
          key={recipe.id}
          fallback={
            <Skeleton className="col-span-12 sm:col-span-3 h-[300px] rounded-lg" />
          }
        >
          <RecipeCard recipe={recipe} />
        </Suspense>
      ))}
      <AddRecipeCard />
    </ul>
  )
}
