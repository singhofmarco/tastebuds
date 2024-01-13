import { EdamamIngredient, EdamamRecipe, OpenAiRecipe } from "@/types";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";

export const RecipeCard = ({ recipe, image }: { recipe: OpenAiRecipe, image: string }) => {
    const {isOpen, onOpen, onClose} = useDisclosure();

    return (
        <>
        <Card className="col-span-12 sm:col-span-3 h-[300px]"
            onClick={() => onOpen()}
            isPressable
            isFooterBlurred>
            <Image
                removeWrapper
                isZoomed
                alt="Card background"
                className="z-0 w-full h-full object-cover"
                src={"data:image/png;base64," + image}
                width={500}
                height={625}
            />
            <CardFooter className="absolute z-10 bottom-0 flex-col !items-start"
            >
                <p className="text-tiny text-white/60 uppercase font-bold">{ recipe.cuisineType }</p>
                <h4 className="text-white font-medium text-large">{ recipe.title }</h4>
            </CardFooter>
        </Card>
        <Modal backdrop='blur' isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{ recipe.title }</ModalHeader>
              <ModalBody>

              <div className="flex gap-4 items-center">
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-25 object-cover"
                        src={"data:image/png;base64," + image}
                        width={75}
                        height={125}
                    />
                    <div className="">
                        <div>Time: { recipe.totalTime }</div>
                    </div>
                </div>
                <h2 className="mt-4 font-bold">Ingredients</h2>
                <ul className="list-disc pl-4">
                    {recipe.ingredients.map((ingredient: string) => (
                        <li key={ingredient}>{ingredient}</li>
                    ))}
                </ul>

                <h2 className="mt-4 font-bold">Steps</h2>
                <ul className="list-disc pl-4">
                    {recipe.steps.map((step: string) => (
                        <li key={step}>{step}</li>
                    ))}
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
        </>
    )
}