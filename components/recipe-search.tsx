"use client"

import { Input } from "@nextui-org/input"
import { SearchIcon } from "./icons"
import { RecipeCard } from "./recipe-card"
import { EdamamHit, OpenAiRecipe } from "@/types"
import { FormEvent, useEffect, useState } from "react"

export const RecipeSearch = ({savedRecipes}: {savedRecipes: any}) => {
    const [query, setQuery] = useState<string>('')
	const [edamamRecipes, setEdamamRecipes] = useState<OpenAiRecipe[]>([])
	const [recipes, setRecipes] = useState<OpenAiRecipe[]>([])
	const [image_url, setImageUrl] = useState<string>('')

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		const res = await fetch(`/api/recipes/generate?query=${query}`)

		const recipes = await res.json()

		setEdamamRecipes([recipes.data])
		setImageUrl(recipes.image_url)
	}

	useEffect(() => {
		const recipesToShow = query.length && edamamRecipes.length ? edamamRecipes : savedRecipes
		setRecipes(recipesToShow)
	}, [query, edamamRecipes, savedRecipes])

    return (
        <div className="mt-8 flex flex-col gap-y-4 px-8">
			<form
				onSubmit={onSubmit}>
				<Input
					aria-label="Search"
					classNames={{
						inputWrapper: "bg-default-100",
						input: "text-sm",
					}}
					labelPlacement="outside"
					placeholder="Search..."
					startContent={
						<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
					}
					type="search"
					autoComplete="off"
					onChange={async (e) => {
						setQuery(e.target.value)
					}}
				/>
			</form>
			<ul className="gap-4 grid grid-cols-12 grid-rows-2">
				{recipes.map((recipe: OpenAiRecipe) => (
					<RecipeCard key={recipe.title} recipe={recipe} />
				))}
			</ul>
        </div>
    )
}