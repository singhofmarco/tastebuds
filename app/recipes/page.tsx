import { subtitle, title } from "@/components/primitives";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeSearch } from "@/components/recipe-search";
import { Recipe } from "@prisma/client"
import prisma from "../lib/prisma";
import AddRecipeCard from "@/components/add-recipe-card";
import AddRecipeButton from "@/components/add-recipe-button";

export default async function RecipesPage({ searchParams }: { searchParams:  { [key: string]: string | string[] | undefined } }) {
	const savedRecipes = await prisma.recipe.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	})

	const query = searchParams.query?.toString()
	const cuisineTypesFilter = searchParams.cuisineTypes

	const filteredRecipes = savedRecipes
	.filter((recipe: Recipe) => {
		if (!query) return true

		return recipe.title.toLowerCase().includes(query.toLowerCase())
	})
	.filter((recipe: Recipe) => {
		if (!cuisineTypesFilter) return true

		return cuisineTypesFilter.includes(recipe.cuisineType)
	})

	const cuisineTypes = savedRecipes.map((recipe: Recipe) => recipe.cuisineType)
		.filter((cuisineType: string, index: number, self: string[]) => self.indexOf(cuisineType) === index)

	return (
		<div className="mt-8 flex flex-col gap-y-4 px-8">
			<div className="mb-4 flex justify-between">
				<div>
					<h1 className={title()}>Recipes</h1>
					<h2 className={subtitle()}>You have { savedRecipes.length } saved.</h2>
				</div>

				{ /* TODO: switch to list mode */ }
			</div>
			<RecipeSearch cuisineTypes={cuisineTypes} />
			{filteredRecipes.length === 0 && (
				<div className="grid justify-center items-center h-full text-center">
					<p className="text-default-400">No recipes found.</p>
				</div>
			)}
			<ul className="gap-4 grid grid-cols-12 grid-rows-2">
				{filteredRecipes.map((recipe: Recipe) => (
					<RecipeCard key={recipe.title} recipe={recipe} />
				))}
				<AddRecipeCard />
			</ul>
		</div>
	);
}
