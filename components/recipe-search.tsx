"use client"

import { Input } from "@nextui-org/input"
import { SearchIcon } from "./icons"
import { RecipeCard } from "./recipe-card"
import { EdamamHit, OpenAiRecipe } from "@/types"
import { FormEvent, useState } from "react"

export const RecipeSearch = () => {
    const [query, setQuery] = useState<string>('')
	const [edamamRecipes, setEdamamRecipes] = useState<OpenAiRecipe[]>([])
	const [image_url, setImageUrl] = useState<string>('')

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		const res = await fetch(`/api/recipes?query=${query}`)

		const recipes = await res.json()

		setEdamamRecipes([recipes.data])
		setImageUrl(recipes.image_url)
	}

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
				{edamamRecipes.map((recipe: OpenAiRecipe) => (
					<RecipeCard key={recipe.title} recipe={recipe} image={image_url} />
				))}
			</ul>
        </div>
    )
}