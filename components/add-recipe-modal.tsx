'use client'

import { save } from '@/app/actions'
import { OpenAiIngredient, OpenAiRecipe } from '@/types'
import { Accordion, AccordionItem } from '@nextui-org/accordion'
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
import { useCallback, useContext, useEffect, useState } from 'react'
import { ClockIcon, GlobeEuropeAfricaIcon } from '@heroicons/react/24/outline'
import SaveRecipeButton from './save-recipe-button'
import { UserContext } from '@/app/providers'
import { useCompletion } from 'ai/react'
import { parse } from 'best-effort-json-parser'
import { Link } from '@nextui-org/link'

export default function AddRecipeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: any
}) {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [recipe, setRecipe] = useState<OpenAiRecipe | null>(null)
  const [error, setError] = useState<string | null>(null)

  const user = useContext(UserContext)

  const {
    complete,
    completion,
    stop,
    input,
    setInput,
    isLoading: isGenerating,
  } = useCompletion({
    api: '/api/recipes/generate',
    onError: (error) => {
      setError(JSON.parse(error.message).error)
    },
  })

  const generateRecipe = useCallback(
    async (query: string) => {
      if (!query.length) {
        setError('Please enter a query')
        return
      }

      setError(null)

      complete(query, {
        body: {
          diet: user?.diet || 'omnivore',
        },
      })
    },
    [complete, user?.diet]
  )

  useEffect(() => {
    if (completion) {
      const parsedCompletion = parse(completion)
      if (parsedCompletion.error) {
        setError(parsedCompletion.error)
        setRecipe(null)
      } else {
        setError(null)
        setRecipe(parsedCompletion)
      }
    }
  }, [completion])

  function clearGeneratedRecipe() {
    setRecipe(null)
    setInput('')
  }

  async function handleSaveRecipe(shouldGenerateImage: boolean) {
    if (!recipe) return

    setIsSaving(true)

    await save(recipe, shouldGenerateImage)
      .then(() => {
        clearGeneratedRecipe()
        onClose()
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  function handleOnClose() {
    if (isGenerating) stop()
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
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {recipe && (
                <>
                  <div>{recipe?.title}</div>
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
                      {recipe?.cuisineType}
                    </Chip>
                    <Chip
                      startContent={<ClockIcon className="w-6 h-6" />}
                      color="success"
                      radius="md"
                      variant="flat"
                    >
                      {recipe?.totalTime}
                    </Chip>
                  </div>
                </>
              )}
              {!recipe && <div>Generate Recipe</div>}
            </ModalHeader>
            <ModalBody className={recipe ? 'pt-0' : ''}>
              {!recipe && (
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
                    isDisabled={isGenerating}
                    isInvalid={error !== null}
                    errorMessage={error}
                  />
                </form>
              )}

              {recipe && (
                <>
                  <p>{recipe?.description}</p>
                  <Accordion
                    className="px-0"
                    variant="splitted"
                    defaultExpandedKeys={['1']}
                  >
                    <AccordionItem
                      key="1"
                      aria-label={`Ingredients for ${recipe.portions} people`}
                      title={`Ingredients for ${recipe.portions} people`}
                      subtitle={
                        (recipe?.ingredients
                          ? recipe?.ingredients?.length
                          : '0') +
                        (isGenerating ? '+' : '') +
                        ' ingredients'
                      }
                    >
                      <ul className="list-disc list-inside">
                        {recipe?.ingredients?.map(
                          (ingredient: OpenAiIngredient, index: number) => (
                            <li key={`Ingredient ${index}`}>
                              {ingredient.name} ({ingredient.quantity}{' '}
                              {ingredient.unit})
                            </li>
                          )
                        )}
                      </ul>
                    </AccordionItem>
                    <AccordionItem
                      key="2"
                      aria-label="Instructions"
                      title="Instructions"
                      subtitle={
                        (recipe?.steps ? recipe?.steps?.length : '0') +
                        (isGenerating ? '+' : '') +
                        ' steps'
                      }
                    >
                      <ul className="list-decimal list-inside space-y-2">
                        {recipe?.steps?.map((step: string, index: number) => (
                          <li key={`Step ${index}`}>{step}</li>
                        ))}
                      </ul>
                    </AccordionItem>
                  </Accordion>
                </>
              )}
            </ModalBody>

            <ModalFooter className="flex flex-col sm:flex-row gap-4">
              {(!recipe || isGenerating) && (
                <Button
                  color="primary"
                  onPress={() => generateRecipe(input)}
                  isDisabled={isGenerating || !input.length}
                  endContent={
                    isGenerating && <Spinner size="sm" color="white" />
                  }
                >
                  {isGenerating ? 'Generating' : 'Generate Recipe'}
                </Button>
              )}

              {!user && (
                <Button
                  variant="light"
                  color="default"
                  as={Link}
                  href="/auth/signin"
                  isDisabled={isGenerating}
                  onPress={() => handleOnClose()}
                >
                  Sign in to save recipes
                </Button>
              )}

              {user && recipe && !isGenerating && (
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
