"use client"

import { Input } from "@nextui-org/input"
import { SearchIcon } from "./icons"
import { RecipeCard } from "./recipe-card"
import { OpenAiRecipe } from "@/types"
import { useEffect, useState } from "react"

export const RecipeSearch = ({savedRecipes}: {savedRecipes: any}) => {
    const [query, setQuery] = useState<string>('')
	const [recipes, setRecipes] = useState<OpenAiRecipe[]>([])

	/**
	 *
	const [edamamRecipes, setEdamamRecipes] = useState<OpenAiRecipe[]>([])
	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		const res = await fetch(`/api/recipes/generate?query=${query}`)

		const recipes = await res.json()

		setEdamamRecipes([recipes.data])
	}
	 */

	useEffect(() => {
		if (query.length) {
			const filteredRecipes = savedRecipes.filter((recipe: OpenAiRecipe) => {
				return recipe.title.toLowerCase().includes(query.toLowerCase()) || recipe.cuisineType.toLowerCase().includes(query.toLowerCase())
			})
			setRecipes(filteredRecipes)
		} else {
			setRecipes(savedRecipes)
		}
	}, [query, savedRecipes])

    return (
        <div className="mt-8 flex flex-col gap-y-4 px-8">
			<form
				className="flex-1"
				onSubmit={(e) => { e.preventDefault() }}
			>
				<div className="flex gap-4">
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
				</div>
			</form>
			<ul className="gap-4 grid grid-cols-12 grid-rows-2">
				{recipes.map((recipe: OpenAiRecipe) => (
					<RecipeCard key={recipe.title} recipe={recipe} />
				))}
			</ul>
        </div>
    )
}