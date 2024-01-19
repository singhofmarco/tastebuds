import { title } from "@/components/primitives";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeSearch } from "@/components/recipe-search";
import { Recipe } from "@prisma/client"
import prisma from "../lib/prisma";

export default async function RecipesPage({ searchParams }: { searchParams:  { [key: string]: string | string[] | undefined } }) {
	const query = searchParams.query?.toString()
	const savedRecipes = await prisma.recipe.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	})

	const filteredRecipes = savedRecipes.filter((recipe: Recipe) => {
		if (!query) return true

		return recipe.title.toLowerCase().includes(query.toLowerCase())
			|| recipe.cuisineType.toLowerCase().includes(query.toLowerCase())
	})

	return (
		<div>
			<div className="text-center">
				<h1 className={title()}>Recipes</h1>
			</div>
			<RecipeSearch>
				<>
					{filteredRecipes.length === 0 && (
						<div className="grid justify-center items-center h-full text-center">
							<p className="text-default-400">No recipes found.</p>
						</div>
					)}
					{filteredRecipes.map((recipe: Recipe) => (
						<RecipeCard key={recipe.title} recipe={recipe} />
					))}
				</>
			</RecipeSearch>
		</div>
	);
}
