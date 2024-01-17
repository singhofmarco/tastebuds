"use client"

import { Input } from "@nextui-org/input"
import { PlusIcon, SearchIcon } from "./icons"
import { useEffect, useState } from "react"
import { Card, CardFooter } from "@nextui-org/card"
import AddRecipeModal from "./add-recipe-modal"
import { useDisclosure } from "@nextui-org/modal"
import { RecipeCard } from "./recipe-card"
import { Recipe } from "@prisma/client"

export const RecipeSearch = ({children, savedRecipes}: {children: React.ReactNode[], savedRecipes: any}) => {
    const [query, setQuery] = useState<string>('')
	const [recipes, setRecipes] = useState<Recipe[]>([])
	const {isOpen: isAddRecipeModalOpen, onOpen: onAddRecipeModalOpen, onClose: onAddRecipeModalClose} = useDisclosure()

	useEffect(() => {
		if (query.length) {
			const filteredRecipes = savedRecipes.filter((recipe: Recipe) => {
				return recipe.title.toLowerCase().includes(query.toLowerCase()) || recipe.cuisineType.toLowerCase().includes(query.toLowerCase())
			})
			setRecipes(filteredRecipes)
		} else {
			setRecipes(savedRecipes)
		}
	}, [query, savedRecipes])

	const filteredRecipes = (
		recipes.map((recipe: Recipe) => (
			<RecipeCard key={recipe.title} recipe={recipe} />
		))
	)

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
			{(query.length > 0 && filteredRecipes.length === 0) && (
				<div className="grid justify-center items-center h-full text-center">
					<p className="text-default-400">No recipes found.</p>
				</div>
			)}
			<ul className="gap-4 grid grid-cols-12 grid-rows-2">
				{ query.length ? filteredRecipes : children }
				<Card
					className="col-span-12 sm:col-span-3 h-[300px] group"
					onPress={onAddRecipeModalOpen}
					isPressable
					isFooterBlurred>
					<PlusIcon className="z-0 p-28 w-full h-full object-cover group-hover:scale-110 transition-transform" />
					<CardFooter className="absolute z-10 bottom-0 flex-col !items-start">
						<p className="text-tiny text-foreground-500 uppercase font-bold">Add</p>
						<h4 className="font-medium text-large">New Recipe</h4>
					</CardFooter>
          		</Card>
			</ul>
			<AddRecipeModal isOpen={isAddRecipeModalOpen} onClose={onAddRecipeModalClose} />
        </div>
    )
}