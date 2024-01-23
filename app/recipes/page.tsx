import { subtitle, title } from "@/components/primitives";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeSearch } from "@/components/recipe-search";
import { Recipe } from "@prisma/client"
import prisma from "@/lib/prisma";
import AddRecipeCard from "@/components/add-recipe-card";
import EmptyView from "@/components/empty-view";
import { Suspense } from "react";
import { Skeleton } from "@nextui-org/skeleton";

export default async function RecipesPage({ searchParams }: { searchParams: { query?: string, cuisineTypes?: string[] } }) {
	const savedRecipes = await prisma.recipe.findMany({
		where: {
			userId: 1 // TODO: get user id from session
		},
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
		<div className="flex flex-col gap-y-4">
			<div className="mb-4 flex justify-between">
				<div className="select-none">
					<h1 className={title()}>Recipes</h1>
					<h2 className={subtitle()}>You have { savedRecipes.length } saved.</h2>
				</div>

				{ /* TODO: switch to list mode */ }
			</div>
			<RecipeSearch cuisineTypes={cuisineTypes} />
			{filteredRecipes.length === 0 && (
				<EmptyView />
			)}

			{filteredRecipes.length > 0 && (
			<ul className="gap-4 grid grid-cols-12 grid-rows-2">
				{filteredRecipes.map((recipe: Recipe) => (
					<Suspense
						key={recipe.id}
						fallback={<Skeleton className="col-span-12 sm:col-span-3 h-[300px] rounded-lg" />}
					>
						<RecipeCard recipe={recipe} />
					</Suspense>
				))}
				<AddRecipeCard />
			</ul>
			)}
		</div>
	);
}
