import { subtitle, title } from '@/components/primitives'
import { RecipeSearch } from '@/components/recipe-search'
import { Recipe } from '@prisma/client'
import prisma from '@/lib/prisma'
import { validateRequest } from '@/auth'
import { redirect } from 'next/navigation'
import RecipesView from '@/components/recipes/recipes-view'

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: { query?: string; cuisineTypes?: string[] }
}) {
  const { user } = await validateRequest()

  if (!user) {
    return redirect('/auth/signin')
  }

  const savedRecipes = await prisma.recipe.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const query = searchParams.query?.toString()
  const cuisineTypesFilter = searchParams.cuisineTypes

  const filteredRecipes = savedRecipes
    .filter((recipe) => {
      if (!query) return true

      return recipe.title.toLowerCase().includes(query.toLowerCase())
    })
    .filter((recipe) => {
      if (!cuisineTypesFilter) return true

      return cuisineTypesFilter.includes(recipe.cuisineType)
    })
    .map((recipe) => ({
      id: recipe.id,
      createdAtDateTime: recipe.createdAt.toISOString(),
      // human readable date
      createdAt: recipe.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      title: recipe.title,
      cuisineType: recipe.cuisineType,
      image: recipe.image,
      totalTime: recipe.totalTime,
    }))

  const cuisineTypes = savedRecipes
    .map((recipe: Recipe) => recipe.cuisineType)
    .filter(
      (cuisineType: string, index: number, self: string[]) =>
        self.indexOf(cuisineType) === index
    )

  return (
    <div className="flex flex-col gap-y-4">
      <div className="px-4 sm:px-8 sm:mb-4 flex justify-between">
        <div className="select-none">
          <h1 className={title()}>Recipes</h1>
          <h2 className={subtitle()}>You have {savedRecipes.length} saved.</h2>
        </div>

        {/* TODO: switch to list mode */}
      </div>
      <RecipeSearch cuisineTypes={cuisineTypes} />

      <RecipesView recipes={filteredRecipes} />
    </div>
  )
}
