import { DeepPartial } from 'ai'
import { z } from 'zod'

export const recipeSchema = z.object({
  recipe: z.object({
    title: z.string().describe('The title of the recipe'),
    totalTime: z
      .string()
      .describe(
        'The total time it takes to make the recipe, including prep and cook time'
      ),
    cuisineType: z
      .string()
      .describe(
        'The type of cuisine the recipe is. Valid values are: American, Italian, Mexican, Chinese, Japanese, Indian, French, Greek, Mediterranean, Thai, Vietnamese, Korean, Spanish, Middle Eastern, British, Caribbean, German, Brazilian,'
      ),
    portions: z
      .number()
      .describe('The number of portions the recipe makes. Default is 4.'),
    description: z
      .string()
      .describe(
        'A description of the recipe. This can include information about the dish, its history, or any other relevant information.'
      ),
    ingredients: z.array(
      z.object({
        name: z.string().describe('The name of the ingredient'),
        quantity: z.number().describe('The quantity of the ingredient'),
        unit: z
          .string()
          .describe(
            'The unit of measurement for the ingredient. Valid values are: grams, kilograms, milliliters, liters, teaspoons, tablespoons, cups, ounces, pounds, pieces.'
          ),
      })
    ),
    steps: z.array(z.string()),
  }),
})

export type PartialRecipe = DeepPartial<typeof recipeSchema>['recipe']

export type Recipe = z.infer<typeof recipeSchema>['recipe']
