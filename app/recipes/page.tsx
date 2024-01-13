import { title } from "@/components/primitives";
import { RecipeSearch } from "@/components/recipe-search";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function RecipesPage() {
	const savedRecipes = await prisma.recipe.findMany()
savedRecipes.map((recipe) => {
	console.log(recipe)	
}
)

	return (
		<div>
			<h1 className={title()}>Recipes</h1>
			<RecipeSearch savedRecipes={savedRecipes} />
		</div>
	);
}
