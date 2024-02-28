'use client'

import { Input } from '@nextui-org/input'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { useEffect, useRef, useTransition } from 'react'
import { Spinner } from '@nextui-org/spinner'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { RecipeCuisineFilter } from './recipe-cuisine-filter'

export const RecipeSearch = ({
  cuisineTypes,
  disabled,
}: {
  cuisineTypes?: string[]
  disabled?: boolean
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const query = searchParams.get('query')?.toString()

  useEffect(() => {
    if (formRef.current && !query?.length) {
      formRef.current.reset()
    }
  }, [query])

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

  return (
    <>
      <div className="px-4 sm:px-8 flex flex-col flex-1 gap-4">
        <form ref={formRef}>
          <Input
            aria-label="Search"
            classNames={{
              inputWrapper: 'bg-default-100 select-none',
              input: 'text-sm',
            }}
            disabled={disabled}
            labelPlacement="outside"
            placeholder="Search..."
            startContent={
              isPending ? (
                <div className="w-5 h-5 flex items-center justify-center">
                  <Spinner size="sm" className="pr-1" color="current" />
                </div>
              ) : (
                <MagnifyingGlassIcon className="w-5 h-5 pr-1 text-base text-default-400 pointer-events-none flex-shrink-0" />
              )
            }
            type="search"
            autoComplete="off"
            defaultValue={query}
            onValueChange={(value) => {
              updateQuery(value)
            }}
          />
        </form>

        <RecipeCuisineFilter
          cuisineTypes={cuisineTypes}
          startTransition={startTransition}
        />
      </div>
    </>
  )
}
