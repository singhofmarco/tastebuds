import { title } from "@/components/primitives";
import { RecipeSearch } from "@/components/recipe-search";

export default async function RecipesPage() {

	return (
		<div>
			<h1 className={title()}>Recipes</h1>
			<RecipeSearch />
		</div>
	);
}
