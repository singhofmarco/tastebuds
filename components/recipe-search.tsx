"use client"

import { Input } from "@nextui-org/input"
import { PlusIcon, SearchIcon } from "./icons"
import { Card, CardFooter } from "@nextui-org/card"
import AddRecipeModal from "./add-recipe-modal"
import { useDisclosure } from "@nextui-org/modal"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export const RecipeSearch = ({ children }: { children: React.ReactElement }) => {
	const {isOpen: isAddRecipeModalOpen, onOpen: onAddRecipeModalOpen, onClose: onAddRecipeModalClose} = useDisclosure()
	const searchParams = useSearchParams()
	const params = new URLSearchParams(searchParams.toString())
	const router = useRouter()

	const updateQuery = useDebouncedCallback((query: string) => {
		if (!query.length) {
			params.delete('query')
		} else {
			params.set('query', query)
		}

		router.push("/recipes?" + params.toString())
	}, 300)

    return (
        <div className="mt-8 flex flex-col gap-y-4 px-8">
			<div className="flex flex-1 gap-4">
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
					defaultValue={params.get('query') || ''}
					onChange={(e) => {
						updateQuery(e.target.value)
					}}
				/>
			</div>
			<ul className="gap-4 grid grid-cols-12 grid-rows-2">
				{ children }
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