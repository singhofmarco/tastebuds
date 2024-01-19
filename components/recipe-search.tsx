"use client"

import { Input } from "@nextui-org/input"
import { SearchIcon } from "./icons"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { Chip } from "@nextui-org/chip"
import { ScrollShadow } from "@nextui-org/scroll-shadow"
import { useEffect, useState, useTransition } from "react"
import { Spinner } from "@nextui-org/spinner"

export const RecipeSearch = ({ cuisineTypes }: { cuisineTypes: string[] }) => {
	const pathname = usePathname()
	const params = new URLSearchParams(window.location.search)

	const { replace } = useRouter()
	const [isPending, startTransition] = useTransition()
	const [cuisineTypesToFilter, setCuisineTypesToFilter] = useState<string[]>(params.get('cuisineTypes')?.split(',') || [])

	const updateQuery = useDebouncedCallback((query: string) => {
		const params = new URLSearchParams(window.location.search)
		if (!query.length) {
			params.delete('query')
		} else {
			params.set('query', query)
		}

		startTransition(() => {
			replace(`${pathname}?${params.toString()}`)
		})
	}, 300)


	useEffect(() => {
		const params = new URLSearchParams(window.location.search)

		params.delete('cuisineTypes')
		if (cuisineTypesToFilter.length === 1) {
			params.set('cuisineTypes', cuisineTypesToFilter[0])
		} else if(cuisineTypesToFilter.length > 1){
			params.set('cuisineTypes', cuisineTypesToFilter.join(','))
		}
		startTransition(() => {
			replace(`${pathname}?${params.toString()}`)
		})
	}, [cuisineTypesToFilter, pathname, replace, startTransition])

	function addCuisineType(cuisineType: string) {
		setCuisineTypesToFilter([...cuisineTypesToFilter, cuisineType])
	}

	function removeCuisineType(cuisineType: string) {
		setCuisineTypesToFilter(cuisineTypesToFilter.filter((ct: string) => ct !== cuisineType))
	}

    return (
      <>
			<div className="flex flex-col flex-1 gap-4">
				<Input
					aria-label="Search"
					classNames={{
						inputWrapper: "bg-default-100",
						input: "text-sm",
					}}
					labelPlacement="outside"
					placeholder="Search..."
					startContent={
						isPending ? (
							<div className="relative w-5 h-5 flex items-center justify-center">
							 <Spinner size="sm" className="pr-1 absolute" color="current" />
							</div>
						  )
						  :
						  <SearchIcon className="w-5 h-5 pr-1 text-base text-default-400 pointer-events-none flex-shrink-0" />
					}
					type="search"
					autoComplete="off"
					defaultValue={params.get('query') || ''}
					onChange={(e) => {
						updateQuery(e.target.value)
					}}
				/>
				<ScrollShadow hideScrollBar orientation="horizontal" className="flex gap-2 max-w-full">
				{ cuisineTypes.map((cuisineType: string, index: number) => {
					const colorMapForIndex: { [key: number]: "primary" | "success" | "warning" | "danger" | "secondary" } = {
						0: "primary",
						1: "success",
						2: "warning",
						3: "danger",
						4: "secondary",
					}

					const color = colorMapForIndex[index % Object.keys(colorMapForIndex).length]

					const isActive = cuisineTypesToFilter.includes(cuisineType)

					return (
					<Chip
						key={cuisineType}
						aria-label="Cuisine Type"
						color={ isActive ? color : "default"}
						variant={isActive ? "solid" : "flat"}
						isCloseable={isActive}
						onClick={() => {
							if (!isActive) {
								addCuisineType(cuisineType)
							}
						}}
						onClose={isActive ? () => {
							removeCuisineType(cuisineType)
						} : undefined}
						>
						{cuisineType}
					</Chip>
				)})}
				</ScrollShadow>
			</div>
        </>
    )
}