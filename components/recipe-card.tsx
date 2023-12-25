import { EdamamRecipe } from "@/types";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

export const RecipeCard = ({ recipe }: { recipe: EdamamRecipe }) => {
    return (
        <Card className="col-span-12 sm:col-span-4 h-[300px]"
            isPressable
            isFooterBlurred>
            <Image
                removeWrapper
                isZoomed
                alt="Card background"
                className="z-0 w-full h-full object-cover"
                src={recipe.image}
                width={500}
                height={625}
            />
            <CardFooter className="absolute z-10 bottom-0 flex-col !items-start"
            >
                <p className="text-tiny text-white/60 uppercase font-bold">{ recipe.cuisineType ? recipe.cuisineType[0] : '' }</p>
                <h4 className="text-white font-medium text-large">{ recipe.label }</h4>
            </CardFooter>
        </Card>
    )
}