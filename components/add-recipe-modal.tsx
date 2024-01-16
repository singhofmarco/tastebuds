"use client";

import { save } from "@/app/actions";
import { OpenAiRecipe } from "@/types";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/modal";
import { Spinner } from "@nextui-org/spinner";
import { useState } from "react";
import { AiIcon, ClockIcon, GlobeIcon } from "./icons";

export default function AddRecipeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: any;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recipe, setRecipe] = useState<OpenAiRecipe | null>(null);
  const [query, setQuery] = useState<string>("");
  const [isQueryInvalid, setIsQueryInvalid] = useState<boolean>(false);

  async function handleGenerateRecipe() {
    if (!query.length) {
      setIsQueryInvalid(true)
      return
    }

    setIsLoading(true);
    const res = await fetch(`/api/recipes/generate?query=${query}`);

    const recipes = await res.json();

    setRecipe(recipes.data);
    setIsLoading(false);
  }

  function clearGeneratedRecipe() {
    setRecipe(null);
    setQuery("");
    setIsLoading(false);
  }

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
                {recipe && (
                    <div>{recipe.title}</div>
                )}
                {!recipe && (
                    <div>Generate recipe</div>
                )}
            </ModalHeader>
            <ModalBody>
                {!recipe && (
              <Input
                autoFocus
                label="What do you want to cook?"
                placeholder="e.g. Chicken Parmesan"
                variant="bordered"
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsQueryInvalid(false);
                }}
                isDisabled={isLoading}
                isInvalid={isQueryInvalid}
              />
                )}

              {!isLoading && recipe && (
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
                  <p>{recipe.description}</p>
                  <Accordion
                    className="px-0"
                    variant="splitted"
                    defaultExpandedKeys={["1"]}
                  >
                    <AccordionItem
                      key="1"
                      aria-label="Ingredients"
                      title="Ingredients"
                      subtitle={recipe.ingredients.length + " items"}
                    >
                      <ul className="list-disc pl-4">
                        {recipe.ingredients.map((ingredient: string) => (
                          <li key={ingredient}>{ingredient}</li>
                        ))}
                      </ul>
                    </AccordionItem>
                    <AccordionItem
                      key="2"
                      aria-label="Instructions"
                      title="Instructions"
                      subtitle={recipe.steps.length + " steps"}
                    >
                      <ul className="list-decimal pl-4">
                        {recipe.steps.map((step: string) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ul>
                    </AccordionItem>
                  </Accordion>
                </>
              )}
            </ModalBody>

            <ModalFooter>
              {!recipe && (
                <Button
                  color="primary"
                  onPress={handleGenerateRecipe}
                  isDisabled={isLoading}
                  endContent={isLoading && <Spinner size="sm" color="white" />}
                >
                  Generate Recipe
                </Button>
              )}

              {recipe && (
                <>
                  <Button color="primary" onPress={() => {
                        save(recipe)
                        onClose()
                  }}>
                    Save
                  </Button>
                  <Button color="danger" onPress={clearGeneratedRecipe}>
                    Generate Another
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
