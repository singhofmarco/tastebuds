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
import { useContext, useState } from 'react'
import { AiIcon, ClockIcon, GlobeIcon } from './icons'
import { makeStreamingJsonRequest } from 'http-streaming-request'
import SaveRecipeButton from './save-recipe-button'
import { UserContext } from '@/app/providers'

export default function AddRecipeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: any
}) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [recipe, setRecipe] = useState<OpenAiRecipe | null>(null)
  const [query, setQuery] = useState<string>('')
  const [isQueryInvalid, setIsQueryInvalid] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const user = useContext(UserContext)

  async function handleGenerateRecipe() {
    if (!query.length) {
      setIsQueryInvalid(true)
      return
    }

    setIsGenerating(true)

    try {
      for await (const recipeResponse of makeStreamingJsonRequest<OpenAiRecipe>(
        {
          url: '/api/recipes/generate',
          payload: {
            query,
            diet: user?.diet,
          },
          method: 'POST',
        }
      )) {
        setRecipe(recipeResponse)
      }
    } catch (e: any) {
      setError('Something went wrong. Please try again.')
      setIsQueryInvalid(true)
    }

    setIsGenerating(false)
  }

  function clearGeneratedRecipe() {
    setRecipe(null)
    setQuery('')
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
    clearGeneratedRecipe()
    setIsQueryInvalid(false)
    setQuery('')
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
              {recipe && <div>{recipe?.title}</div>}
              {!recipe && <div>Generate Recipe</div>}
            </ModalHeader>
            <ModalBody>
              {!recipe && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleGenerateRecipe()
                  }}
                >
                  <Input
                    autoFocus
                    label="What do you want to cook?"
                    placeholder="e.g. Chicken Parmesan"
                    variant="bordered"
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setIsQueryInvalid(false)
                    }}
                    isDisabled={isGenerating}
                    isInvalid={isQueryInvalid}
                    errorMessage={isQueryInvalid ? error : undefined}
                  />
                </form>
              )}

              {recipe && (
                <>
                  <div className="flex gap-4 items-start">
                    <div className="w-24 h-24 shadow-md rounded-sm bg-foreground-100 flex justify-center items-center">
                      <AiIcon className="w-8 h-8 text-foreground" />
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <Chip
                        aria-label="Cuisine Type"
                        color="primary"
                        variant="flat"
                        startContent={<GlobeIcon />}
                      >
                        {recipe?.cuisineType}
                      </Chip>
                      <Chip
                        startContent={<ClockIcon />}
                        color="success"
                        variant="flat"
                      >
                        {recipe?.totalTime}
                      </Chip>
                    </div>
                  </div>
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
                      <ul className="list-disc pl-4">
                        {recipe?.ingredients?.map(
                          (ingredient: OpenAiIngredient) => (
                            <li key={ingredient.name}>
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
                      <ul className="list-decimal pl-4">
                        {recipe?.steps?.map((step: string) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ul>
                    </AccordionItem>
                  </Accordion>
                </>
              )}
            </ModalBody>

            <ModalFooter>
              {(!recipe || isGenerating) && (
                <Button
                  color="primary"
                  onPress={handleGenerateRecipe}
                  isDisabled={isGenerating || !query.length}
                  endContent={
                    isGenerating && <Spinner size="sm" color="white" />
                  }
                >
                  {isGenerating ? 'Generating' : 'Generate Recipe'}
                </Button>
              )}

              {recipe && !isGenerating && (
                <>
                  <SaveRecipeButton
                    handleSaveRecipe={handleSaveRecipe}
                    isSaving={isSaving}
                  />
                  <Button
                    variant="flat"
                    color="default"
                    onPress={clearGeneratedRecipe}
                    isDisabled={isSaving}
                  >
                    Generate Another
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
