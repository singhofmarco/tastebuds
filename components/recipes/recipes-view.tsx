'use client'

import { Recipe } from '@prisma/client'
import GridView from '@/components/recipes/grid-view'
import EmptyView from '@/components/empty-view'
import ListView from '@/components/recipes/list-view'
import { useView } from '@/app/hooks/use-view'

export type ViewRecipe = Pick<
  Recipe,
  'id' | 'title' | 'cuisineType' | 'image' | 'totalTime'
> & { createdAtDateTime: string; createdAt: string }

interface RecipesViewProps {
  recipes: ViewRecipe[]
}

export default function RecipesView({ recipes }: RecipesViewProps) {
  const { view } = useView()

  if (recipes.length === 0) {
    return <EmptyView />
  }

  if (view === 'list') {
    return <ListView recipes={recipes} />
  }

  return <GridView recipes={recipes} />
}
