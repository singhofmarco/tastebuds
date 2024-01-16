import { PrismaClient } from "@prisma/client"
import Image from "next/image";
import { subtitle, title } from "@/components/primitives";
import { Chip } from "@nextui-org/chip";
import { ClockIcon, GlobeIcon } from "@/components/icons";
import Breadcrumbs from "@/components/breadcrumbs";
import BreadcrumbItem from "@/components/breadcrumb-item";
import RecipeImage from "@/components/recipe-image";

const prisma = new PrismaClient().$extends({
	result: {
		recipe: {
		  saved: {
			compute() {
			  return true
			},
		  },
		},
	  },
})

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
    const recipe = await prisma.recipe.findUnique({
        where: {
            id: Number(params.id)
        }
    })

    if (!recipe) {
        return (
            <div className="flex flex-col items-center justify-center gap-8 py-8 md:py-10">
                <Image src="/logo.svg"
                    alt="Tastebuds"
                    width={680}
                    height={823}
                    className="w-48 h-48" />
                <div className="inline-block max-w-lg text-center justify-center">
                    <h1 className={title()}>404</h1>
                    <h2 className={subtitle({ class: "mt-4" })}>
                        Recipe not found.
                    </h2>
                </div>
            </div>
        )
    }

    const ingredients = recipe.ingredients && recipe.ingredients instanceof Object ? recipe.ingredients : JSON.parse(recipe.ingredients?.toString() || "[]")
    const steps = recipe.steps && recipe.steps instanceof Object ? recipe.steps : JSON.parse(recipe.steps?.toString() || "[]")

    return (
        <>
        <Breadcrumbs className="hidden md:block">
            <BreadcrumbItem href="/recipes">Recipes</BreadcrumbItem>
            <BreadcrumbItem href="#" current>{recipe.title}</BreadcrumbItem>
        </Breadcrumbs>

        <div className="md:mt-8 lg:grid lg:grid-cols-5 lg:items-start lg:gap-x-8">
            <div className="col-span-2">
                  <RecipeImage recipe={recipe} />
            </div>

            <div className="col-span-3 mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className={title()}>{recipe.title}</h1>



              <div className="mt-4 flex items-center gap-4">
                    <Chip
                        aria-label="Cuisine Type"
                        color="primary"
                        variant="flat"
                        startContent={<GlobeIcon />}
                        >
                        {recipe.cuisineType}
                    </Chip>
                    <Chip
                        startContent={<ClockIcon />}
                        color="success"
                        variant="flat"
                        >
                        {recipe.totalTime}
                    </Chip>
                </div>

              <div className="mt-6 bg-foreground-50 border border-foreground-100 p-4 rounded-md shadow-sm">
                <h3 className="sr-only">Description</h3>

                <div
                  className="space-y-6 text-base"
                >
                    {recipe.description}
                 </div>
              </div>

              <section aria-labelledby="details-heading" className="mt-12">
                <h2 id="details-heading" className="sr-only">
                  Additional details
                </h2>

                <div>
                    <h3 className={subtitle()}>Ingredients</h3>

                    <div className="mt-4">
                        <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                        {ingredients?.map((ingredient: string) => (
                            <li key={ingredient} className="text-gray-400">
                            <span className="text-foreground">{ingredient}</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>

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
    );
}