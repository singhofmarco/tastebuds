import { subtitle, title } from '@/components/primitives'
import { Chip } from '@nextui-org/chip'
import { ClockIcon, GlobeAmericasIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/breadcrumbs'
import BreadcrumbItem from '@/components/breadcrumb-item'
import RecipeImage from '@/components/recipe-image'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import RecipeDropdown from '@/components/recipe-dropdown'
import Ingredients from '@/components/ingredients'

export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const recipe = await prisma.recipe.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      ingredients: true,
    },
  })

  if (!recipe) {
    notFound()
  }

  const steps =
    recipe.steps && recipe.steps instanceof Object
      ? recipe.steps
      : JSON.parse(recipe.steps?.toString() || '[]')

  return (
    <>
      <Breadcrumbs className="hidden md:block">
        <BreadcrumbItem href="/recipes">Recipes</BreadcrumbItem>
        <BreadcrumbItem href="#" current>
          {recipe.title}
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="md:mt-8 lg:grid lg:grid-cols-5 lg:items-start lg:gap-x-8">
        <div className="col-span-2">
          <RecipeImage
            recipeId={recipe.id}
            image={recipe.image}
            title={recipe.title}
            isGeneratingImage={recipe.isGeneratingImage}
          />
        </div>

        <div className="col-span-3 mt-10 sm:mt-16 lg:mt-0">
          <div className="flex justify-between">
            <div>
              <h1 className={title()}>{recipe.title}</h1>

              <div className="mt-4 flex items-center gap-4 select-none">
                <Chip
                  aria-label="Cuisine Type"
                  color="danger"
                  variant="flat"
                  startContent={<GlobeAmericasIcon className="w-6 h-6" />}
                >
                  {recipe.cuisineType}
                </Chip>
                <Chip
                  startContent={<ClockIcon className="w-6 h-6" />}
                  color="success"
                  variant="flat"
                >
                  {recipe.totalTime}
                </Chip>
              </div>
            </div>
            <RecipeDropdown className="ml-4 select-none" recipeId={recipe.id} />
          </div>
          <div className="mt-6 bg-foreground-50 border border-foreground-100 p-4 rounded-md shadow-sm">
            <h3 className="sr-only">Description</h3>

            <div className="space-y-6 text-base">{recipe.description}</div>
          </div>

          <section aria-labelledby="details-heading" className="mt-12">
            <h2 id="details-heading" className="sr-only">
              Additional details
            </h2>

            <Ingredients
              ingredients={recipe.ingredients}
              portions={recipe.portions}
            />

            <div className="mt-10">
              <h2 className={subtitle()}>Steps</h2>

              <div className="mt-4 space-y-6">
                <ul role="list" className="list-decimal space-y-2 pl-4 text-sm">
                  {steps?.map((step: string) => (
                    <li key={step} className="text-gray-400">
                      <span className="text-foreground">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
