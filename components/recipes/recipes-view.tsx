'use client'

import { Recipe } from '@prisma/client'
import { useState } from 'react'
import GridView from '@/components/recipes/grid-view'
import EmptyView from '@/components/empty-view'
import ListView from '@/components/recipes/list-view'

export type ViewRecipe = Pick<
  Recipe,
  'id' | 'title' | 'cuisineType' | 'image' | 'totalTime'
> & { createdAtDateTime: string; createdAt: string }

interface RecipesViewProps {
  recipes: ViewRecipe[]
}

export default function RecipesView({ recipes }: RecipesViewProps) {
  const [isListView, setIsListView] = useState(true)

  if (recipes.length === 0) {
    return <EmptyView />
  }

  if (isListView) {
    return <ListView recipes={recipes} />
  }

  return <GridView recipes={recipes} />
}
