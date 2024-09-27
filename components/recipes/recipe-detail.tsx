import { PartialRecipe, Recipe } from '@/app/api/recipes/schema'
import { Accordion, AccordionItem } from '@nextui-org/accordion'

export default function RecipeDetail({
  recipe,
  isLoading = false,
}: {
  recipe: PartialRecipe | Recipe
  isLoading?: boolean
}) {
  return (
    <>
      <p>{recipe?.description}</p>
      <Accordion
        className="px-0"
        variant="splitted"
        defaultExpandedKeys={['1']}
      >
        <AccordionItem
          key="1"
          aria-label={`Ingredients for ${recipe?.portions ?? '4'} people`}
          title={`Ingredients for ${recipe?.portions ?? '4'} people`}
          subtitle={
            (recipe?.ingredients ? recipe?.ingredients?.length : '0') +
            (isLoading ? '+' : '') +
            ' ingredients'
          }
        >
          <ul className="list-disc list-inside">
            {recipe?.ingredients?.map((ingredient, index: number) => (
              <li key={`Ingredient ${index}`}>
                {ingredient?.name} ({ingredient?.quantity} {ingredient?.unit})
              </li>
            ))}
          </ul>
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Instructions"
          title="Instructions"
          subtitle={
            (recipe?.steps ? recipe?.steps?.length : '0') +
            (isLoading ? '+' : '') +
            ' steps'
          }
        >
          <ul className="list-decimal list-inside space-y-2">
            {recipe?.steps?.map((step, index: number) => (
              <li key={`Step ${index}`}>{step}</li>
            ))}
          </ul>
        </AccordionItem>
      </Accordion>
    </>
  )
}
