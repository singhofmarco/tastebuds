export type OpenAiRecipe = {
  id: string
  title: string
  ingredients: OpenAiIngredient[]
  steps: string[]
  totalTime: string
  cuisineType: string
  portions: number
  description: string
  image?: string
  saved: boolean
}

export type OpenAiIngredient = {
  name: string
  quantity: number
  unit: string
}
