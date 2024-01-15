import { OpenAiRecipe } from "@/types";
import { Card, CardFooter } from "@nextui-org/card";
import Link from "next/link";
import Image from "next/image";

export const RecipeCard = ({ recipe }: { recipe: OpenAiRecipe }) => {
    return (
        <Link
          href={`/recipes/${recipe.id}`}
          className="col-span-12 sm:col-span-3 h-[300px]"
        >
          <Card
              className="h-full group"
              isFooterBlurred>
              <Image
                  alt="Card background"
                  className="z-0 w-full h-full object-cover group-hover:scale-110 transition-transform"
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
    )
}