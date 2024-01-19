import { title } from "@/components/primitives";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeSearch } from "@/components/recipe-search";
import { Recipe } from "@prisma/client"
import prisma from "../lib/prisma";

export default async function RecipesPage() {
	const savedRecipes = await prisma.recipe.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	})

	return (
		<div>
			<div className="text-center">
				<h1 className={title()}>Recipes</h1>
			</div>
			<RecipeSearch savedRecipes={savedRecipes}>
				{savedRecipes.map((recipe: Recipe) => (
					<RecipeCard key={recipe.title} recipe={recipe} />
				))}
			</RecipeSearch>
		</div>
	);
}
