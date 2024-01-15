import { OpenAiRecipe } from "@/types";
import { Button } from "@nextui-org/button";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Card, CardFooter } from "@nextui-org/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { save } from "@/app/actions";
import Link from "next/link";
import Image from "next/image";

export const RecipeCard = ({ recipe }: { recipe: OpenAiRecipe }) => {
    const {isOpen, onOpen, onClose} = useDisclosure();

    return (
        <>
        <Link
          href={`/recipes/${recipe.id}`}
          className="col-span-12 sm:col-span-3 h-[300px]"
        >
          <Card
              className="h-full"
              isFooterBlurred>
              <Image
                  alt="Card background"
                  className="z-0 w-full h-full object-cover hover:scale-110 transition-all"
                  src={recipe.image}
                  width={500}
                  height={625}
              />
              <CardFooter className="absolute z-10 bottom-0 flex-col !items-start"
              >
                  <p className="text-tiny text-white/60 uppercase font-bold">{ recipe.cuisineType }</p>
                  <h4 className="text-white font-medium text-large">{ recipe.title }</h4>
              </CardFooter>
          </Card>
        </Link>
        <Modal backdrop='blur' isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">
                <div>{ recipe.title }</div>
                <div className="text-tiny text-black/60 uppercase font-bold">{ recipe.cuisineType }</div>
              </ModalHeader>
              <ModalBody>

              <div className="flex gap-4 items-start">
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-28 object-cover"
                        src={recipe.image}
                        width={75}
                        height={125}
                    />
                    <div>Time: { recipe.totalTime }</div>
                </div>
                <p>{recipe.description}</p>
                <Accordion className="px-0" variant="splitted" defaultExpandedKeys={['1']}>
                  <AccordionItem key="1" aria-label="Ingredients" title="Ingredients"  subtitle={recipe.ingredients.length + " items"}>
                    <ul className="list-disc pl-4">
                      {recipe.ingredients.map((ingredient: string) => (
                          <li key={ingredient}>{ingredient}</li>
                      ))}
                    </ul>
                  </AccordionItem>
                  <AccordionItem key="2" aria-label="Instructions" title="Instructions" subtitle={recipe.steps.length + " steps"}>
                    <ul className="list-decimal pl-4">
                      {recipe.steps.map((step: string) => (
                          <li key={step}>{step}</li>
                      ))}
                    </ul>
                  </AccordionItem>
                </Accordion>
              </ModalBody>

              <ModalFooter>
              { ! recipe.saved && (
                <Button color="primary" onPress={() => save(recipe)}>
                  Save
                </Button>
              )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
        </>
    )
}