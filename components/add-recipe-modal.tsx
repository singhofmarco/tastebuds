'use client'

import { save } from '@/app/actions'
import { Button } from '@nextui-org/button'
import { Chip } from '@nextui-org/chip'
import { Input } from '@nextui-org/input'
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@nextui-org/modal'
import { Spinner } from '@nextui-org/spinner'
import { useContext, useState } from 'react'
import { ClockIcon, GlobeEuropeAfricaIcon } from '@heroicons/react/24/outline'
import SaveRecipeButton from './save-recipe-button'
import { UserContext } from '@/app/providers'
import { Link } from '@nextui-org/link'
import { experimental_useObject as useObject } from 'ai/react'
import { Recipe, recipeSchema } from '@/app/api/recipes/schema'
import RecipeDetail from './recipes/recipe-detail'

export default function AddRecipeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: any
}) {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState<string>('')
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null)

  const user = useContext(UserContext)

  const { object, submit, isLoading, stop } = useObject({
    api: '/api/recipes/generate',
    onError: (error) => {
      setError(error.message)
      setIsSubmitted(false)
      setGeneratedRecipe(null)
    },
    onFinish({ object }) {
      if (object?.recipe === undefined) {
        setError('An error occurred while generating the recipe')
        setIsSubmitted(false)
        setGeneratedRecipe(null)
        return
      }

      if (object.recipe !== null) {
        setGeneratedRecipe(object.recipe)
      }
    },
    schema: recipeSchema,
  })

  const generateRecipe = async (query: string) => {
    if (!query.length) {
      setError('Please enter a query')
      return
    }

    setError(null)
    setIsSubmitted(true)

    submit({
      prompt: query,
      diet: user?.diet || 'omnivore',
    })
  }

  function clearGeneratedRecipe() {
    setInput('')
    setGeneratedRecipe(null)
    setIsSubmitted(false)
  }

  async function handleSaveRecipe(shouldGenerateImage: boolean) {
    if (!generatedRecipe) return

    setIsSaving(true)

    await save(generatedRecipe, shouldGenerateImage)
      .then(() => {
        clearGeneratedRecipe()
        onClose()
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  function handleOnClose() {
    if (isLoading) stop()
    clearGeneratedRecipe()
    setError(null)
    onClose()
  }

  return (
    <Modal
      backdrop="blur"
      size="2xl"
      isOpen={isOpen}
      onClose={handleOnClose}
      placement="top-center"
    >
      <ModalContent className="select-none">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isSubmitted && object?.recipe && (
                <>
                  <div>{object.recipe?.title}</div>
                  <div className="mt-2 flex gap-4 items-start">
                    <Chip
                      aria-label="Cuisine Type"
                      color="primary"
                      variant="flat"
                      radius="md"
                      startContent={
                        <GlobeEuropeAfricaIcon className="w-6 h-6" />
                      }
                    >
                      {object.recipe?.cuisineType}
                    </Chip>
                    <Chip
                      startContent={<ClockIcon className="w-6 h-6" />}
                      color="success"
                      radius="md"
                      variant="flat"
                    >
                      {object.recipe?.totalTime}
                    </Chip>
                  </div>
                </>
              )}
              {!isSubmitted && <div>Generate Recipe</div>}
            </ModalHeader>
            <ModalBody className={object?.recipe ? 'pt-0' : ''}>
              {!(isSubmitted && object?.recipe) && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    generateRecipe(input)
                  }}
                >
                  <Input
                    autoFocus
                    label="What do you want to cook?"
                    placeholder="e.g. Chicken Parmesan"
                    variant="bordered"
                    maxLength={100}
                    endContent={
                      <span className="text-foreground-400">
                        {input.length}/100
                      </span>
                    }
                    onChange={(e) => {
                      setInput(e.target.value)
                      setError(null)
                    }}
                    isDisabled={isLoading}
                    isInvalid={error !== null}
                    errorMessage={error}
                  />
                </form>
              )}

              {isSubmitted && object?.recipe && (
                <RecipeDetail recipe={object.recipe} isLoading={isLoading} />
              )}
            </ModalBody>

            <ModalFooter className="flex flex-col sm:flex-row gap-4">
              {!isSubmitted && (
                <Button
                  color="primary"
                  onPress={() => generateRecipe(input)}
                  isDisabled={isLoading || !input.length}
                  endContent={isLoading && <Spinner size="sm" color="white" />}
                >
                  {isLoading ? 'Generating' : 'Generate Recipe'}
                </Button>
              )}

              {!user && (
                <Button
                  variant="light"
                  color="default"
                  as={Link}
                  href="/auth/signin"
                  isDisabled={isLoading}
                  onPress={() => handleOnClose()}
                >
                  Sign in to save recipes
                </Button>
              )}

              {user && isSubmitted && object?.recipe && !isLoading && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="flat"
                    color="danger"
                    onPress={clearGeneratedRecipe}
                    isDisabled={isSaving}
                    fullWidth
                  >
                    Start over
                  </Button>
                  <SaveRecipeButton
                    handleSaveRecipe={handleSaveRecipe}
                    isSaving={isSaving}
                  />
                </div>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
